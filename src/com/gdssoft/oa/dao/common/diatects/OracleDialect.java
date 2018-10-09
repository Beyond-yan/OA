package com.gdssoft.oa.dao.common.diatects;

import org.springframework.stereotype.Repository;

import com.gdssoft.oa.dao.common.Dialect;



@Repository("oracleDialect")
public class OracleDialect implements Dialect {
	
	@Override
	public boolean supportsPaging() {
		return true;
	}

	@Override
	public String getNormalString(String sql) {
sql = trim(sql);
        
		StringBuffer sb = new StringBuffer(sql.length() + 55);
        sb.append("SELECT rownum as rowNo, row_1.* FROM (").append(sql);
        sb.append(") row_1 WHERE 1=1");
        
        return sb.toString();
	}
	
	@Override
	public String getPagingString(String sql, int skipResults, int maxResults) {
		sql = trim(sql);
        
		StringBuffer sb = new StringBuffer(sql.length() + 130);
        sb.append("SELECT * FROM (SELECT rownum as rowNo, row_1.* FROM (").append(sql);
        sb.append(") row_1 WHERE 1=1) row_2 WHERE row_2.RowNo >= ").append(skipResults);
        sb.append(" AND row_2.RowNo < ").append(skipResults+maxResults);
        
        return sb.toString();
	}

	@Override
	public String getTotalString(String sql) {
		sql = trim(sql);
        
		StringBuffer sb = new StringBuffer(sql.length() + 40);
        sb.append("SELECT COUNT(1) FROM (").append(sql);
        sb.append(") row_tc WHERE 1=1");
        
        return sb.toString();
	}

	private String trim(String sql) {
        sql = sql.trim();
        return sql;
    }
}
