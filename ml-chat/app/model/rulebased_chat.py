from dataclasses import dataclass
import os

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


RZD_MAP = {
    '2М62': '1', '2М62У': '1', '2ТЭ10М': '2', '2ТЭ10МК': '2', '2ТЭ10У': '2', '2ТЭ10УК': '2',
    '2ТЭ25А': '3', '2ТЭ25КМ': '4', '2ТЭ70': '5', '2ТЭ116': '6', '2ТЭ116УД': '7', '2ЭС4К': '8',
    '2ЭС5К': '9', '3ЭС5К': '9', '2ЭС6': '10', '2ЭС7': '11', '2ЭС10': '12', 'ВЛ10': '13',
    'ВЛ10У': '13', 'ВЛ10К': '14', 'ВЛ11': '15', 'ВЛ11М': ['15', '16'], 'ВЛ15': '17',
    'ВЛ65': '18', 'ВЛ80Р': '19', 'ВЛ80С': '20', 'ВЛ80Т': '21', 'ВЛ85': '22', 'ТЭМ2': '23',
    'ТЭМ7А': '24', 'ТЭМ14': '25', 'ТЭМ18Д': '26', 'ТЭМ18ДМ': '26', 'ТЭП70': '27', 'ТЭП70БС': '28',
    'ЧМЭ3': '29', 'ЧС2': '30', 'ЧС2К': '31', 'ЧС2Т': '32', 'ЧС4Т': '33', 'ЧС6': '34', 'ЧС200': '34',
    'ЧС7': '35', 'ЧС8': '36', 'ЭП1': '37', 'ЭП1М': '37', 'ЭП2К': '38', 'ЭП10': '39', 'ЭП20': '40'
}

LEVEL_MAP = {
    0: 'ЗАПРОС',
    1: 'Неисправность',
    2: 'Вероятная причина',
    3: 'Метод устранения'
}

LEVEL_0_TEMPLATE = '''По вашему запросу найдены следующие возможные неисправности:
{TEXT}
Уточните о какой из неисправностей хотите узнать подробнее.'''

LEVEL_1_TEMPLATE = '''У данного вида неисправности могут быть следующие причины:
{TEXT}Надеюсь консультация от banz.ai-bot была полезной!
'''


@dataclass
class EventItem:
    request: str
    fault: str
    reason: str
    solution: str


def fit_tfidf(data):
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(data)
    return tfidf, tfidf_matrix


def find_similar_queries(query, data, tfidf, tfidf_matrix):
    query_vector = tfidf.transform([query])
    similarity_scores = cosine_similarity(query_vector, tfidf_matrix)
    most_similar_query_index = similarity_scores.argsort()[0][-2]
    most_similar_query = data[most_similar_query_index]
    return most_similar_query


def get_data_frame(data_path, train_id):
    data_file = RZD_MAP[train_id]
    if isinstance(data_file, str):
        return pd.read_excel(os.path.join(data_path, f'{data_file}.xlsx'))
    elif isinstance(data_file, list):
        data = []
        for file in data_file:
            tmp = pd.read_excel(os.path.join(data_path, f'{file}.xlsx'))
            data.append(tmp)
        return pd.concat(data)


def rule_based_process(query, train_id, data_path):
    data_frame = get_data_frame(data_path, train_id)
    data = data_frame[LEVEL_MAP[0]]
    tfidf, tfidf_matrix = fit_tfidf(data)
    relevant = find_similar_queries(query[0], data, tfidf, tfidf_matrix)
    if len(query) == 1:
        res = data_frame[data_frame[LEVEL_MAP[0]] == relevant][LEVEL_MAP[1]].unique()
        if not res.any():
            input_ = data_frame[data_frame[LEVEL_MAP[0]] == relevant][LEVEL_MAP[3]][0]
            return LEVEL_0_TEMPLATE.replace('{TEXT}', input_)
        else:
            input_ = ""
            for fault in res:
                input_ += f"    - {fault}\n"
            return LEVEL_0_TEMPLATE.replace('{TEXT}', input_)
    else:
        data = get_data_frame(data_path, train_id)
        data = data[data[LEVEL_MAP[0]] == relevant][LEVEL_MAP[1]]
        tfidf, tfidf_matrix = fit_tfidf(data)
        relevant = find_similar_queries(query[-1], data, tfidf, tfidf_matrix)
        res = data_frame[data_frame[LEVEL_MAP[1]] == relevant]
        if not res[LEVEL_MAP[2]].any():
            input_ = res[LEVEL_MAP[3]][0]
            return LEVEL_1_TEMPLATE.replace('{TEXT}', input_)
        else:
            input_ = ""
            for i, fault in res.iterrows():
                input_ += f"    - Причина: {fault[LEVEL_MAP[2]]}\n      Метод устранения: {fault[LEVEL_MAP[3]]}\n\n"
            return LEVEL_1_TEMPLATE.replace('{TEXT}', input_)