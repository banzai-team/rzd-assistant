import logging

from huggingface_hub import snapshot_download
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.document_loaders import TextLoader
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from llama_cpp import Llama

repo_name = "IlyaGusev/saiga2_13b_gguf"
model_name = "ggml-model-q4_K.gguf"

callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
n_gpu_layers = 1  # Metal set to 1 is enough.
n_batch = 512  # Should be between 1 and n_ctx, consider the amount of RAM of your Apple Silicon Chip.
model_path = f"./data/{model_name}"
db_path = "./data/test.txt"
model=None

def load_modules():
    snapshot_download(repo_id=repo_name, local_dir="./data/", allow_patterns=model_name)
    model = Llama(
        model_path=model_path,
        n_gpu_layers=n_gpu_layers,
        n_batch=n_batch,
        n_ctx=2048,
        f16_kv=True,  # MUST set to True, otherwise you will run into problem after a couple of calls
        # callback_manager=callback_manager,
        verbose=True,
    )

if False:
    load_modules()

embedder_name = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"

SYSTEM_PROMPT = "Ты — Сайга, русскоязычный автоматический ассистент. Ты разговариваешь с людьми и помогаешь им."
SYSTEM_TOKEN = 1788
USER_TOKEN = 1404
BOT_TOKEN = 9225
LINEBREAK_TOKEN = 13
max_new_tokens = 1500

ROLE_TOKENS = {
    "user": USER_TOKEN,
    "bot": BOT_TOKEN,
    "system": SYSTEM_TOKEN
}


def get_message_tokens(model, role, content):
    message_tokens = model.tokenize(content.encode("utf-8"))
    message_tokens.insert(1, ROLE_TOKENS[role])
    message_tokens.insert(2, LINEBREAK_TOKEN)
    message_tokens.append(model.token_eos())
    return message_tokens


def get_system_tokens(model):
    system_message = {"role": "system", "content": SYSTEM_PROMPT}
    return get_message_tokens(model, **system_message)


def process_text(text):
    lines = text.split("\n")
    lines = [line for line in lines if len(line.strip()) > 2]
    text = "\n".join(lines).strip()
    if len(text) < 10:
        return None
    return text


def load_db(file_path):
    embeddings = HuggingFaceEmbeddings(model_name=embedder_name)
    loader = TextLoader(file_path=file_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=100)
    splitted_docs = text_splitter.split_documents(documents)
    fixed_documents = []
    for doc in splitted_docs:
        doc.page_content = process_text(doc.page_content)
        if not doc.page_content:
            continue
        fixed_documents.append(doc)

    docsearch = Chroma.from_documents(fixed_documents, embeddings)
    return docsearch


def retrieve(history, db, retrieved_docs, k_documents):
    if db:
        last_user_message = history[-1][0]
        retriever = db.as_retriever(search_kwargs={"k": k_documents})
        docs = retriever.get_relevant_documents(last_user_message)
        retrieved_docs = "\n\n".join([doc.page_content for doc in docs])
    return retrieved_docs


def process(query: str, chat_history: [str]):
    chat_history = [[query]]
    logging.info("db: started to load")
    db = load_db(db_path)
    logging.info("db: loaded")
    retrieved_docs = retrieve(chat_history, db, [], 5)
    last_user_message = chat_history[-1][0]
    if retrieved_docs:
        last_user_message = f"Контекст: {retrieved_docs}\n\nИспользуя контекст, ответь на вопрос: {last_user_message}"
    tokens = get_system_tokens(model)[:]
    tokens.append(LINEBREAK_TOKEN)
    role_tokens = [model.token_bos(), BOT_TOKEN, LINEBREAK_TOKEN]
    tokens.extend(role_tokens)

    logging.info("model: running model")

    generator = model.generate(
        tokens,
        top_k=30,
        top_p=0.9,
        temp=0.1
    )

    message_tokens = get_message_tokens(model=model, role="user", content=last_user_message)
    tokens.extend(message_tokens)

    partial_text = ""
    for i, token in enumerate(generator):
        if token == model.token_eos() or (max_new_tokens is not None and i >= max_new_tokens):
            break
        partial_text += model.detokenize([token]).decode("utf-8", "ignore")

    return partial_text
