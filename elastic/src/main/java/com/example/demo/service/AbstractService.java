package com.example.demo.service;

import com.example.demo.criteria.BaseCriteria;
import org.elasticsearch.index.query.*;

import java.time.LocalDate;

public class AbstractService {

    protected void addPredicate(BoolQueryBuilder boolQuery, String fieldName, LocalDate value, LocalDate valueMin, LocalDate valueMax) {
        RangeQueryBuilder rangeQuery = QueryBuilders.rangeQuery(fieldName);

        if (value != null) {
            rangeQuery.gte(value.toString()).lte(value.toString());
        }
        if (valueMin != null) {
            rangeQuery.gte(valueMin);
        }
        if (valueMax != null) {
            rangeQuery.lte(valueMax);
        }
        boolQuery.must(rangeQuery);

    }


    protected void addPredicate(BoolQueryBuilder boolQuery, String fieldName, String value, String valueLike) {
        if (valueLike != null && !valueLike.isEmpty()) {
            WildcardQueryBuilder wildcardQuery = QueryBuilders.wildcardQuery(fieldName, "*" + valueLike + "*");
            boolQuery.must(wildcardQuery);
        }
        if (value != null) {
            boolQuery.must(QueryBuilders.termQuery(fieldName, value));
        }

    }

    protected void addPredicate(BoolQueryBuilder boolQuery, String fieldName, String value) {
        addPredicate(boolQuery, fieldName, null, value);

    }

    protected void addPredicateFk(BoolQueryBuilder boolQuery, String fieldName, BaseCriteria baseCriteria) {
        if (baseCriteria != null) {
            addPredicate(boolQuery, fieldName, baseCriteria.getCodeValue(), null);
        }

    }
    protected void addPredicate(BoolQueryBuilder boolQuery, String fieldName, Double value) {
        if (value != null) {
            boolQuery.must(QueryBuilders.matchQuery(fieldName, value));
        }
    }

    protected void addPredicateBool(BoolQueryBuilder boolQuery, String fieldName, Boolean value) {
        if (value != null) {
            boolQuery.must(QueryBuilders.matchQuery(fieldName, value));
        }
    }


    protected void addPredicateLong(BoolQueryBuilder boolQuery, String fieldName, String value, String valueMin, String valueMax) {
        RangeQueryBuilder rangeQuery = QueryBuilders.rangeQuery(fieldName);
        if (valueMin != null) {
            rangeQuery.gte(valueMin);
        }
        if (valueMax != null) {
            rangeQuery.lte(valueMax);
        }
        if (value != null) {
            rangeQuery.gte(value);
            rangeQuery.lte(value);
        }
        boolQuery.must(rangeQuery);
    }



}
