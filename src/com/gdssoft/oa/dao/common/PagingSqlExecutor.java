package com.gdssoft.oa.dao.common;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import com.ibatis.sqlmap.engine.execution.SqlExecutor;
import com.ibatis.sqlmap.engine.mapping.parameter.ParameterMap;
import com.ibatis.sqlmap.engine.mapping.parameter.ParameterMapping;
import com.ibatis.sqlmap.engine.mapping.statement.RowHandlerCallback;
import com.ibatis.sqlmap.engine.scope.StatementScope;
import com.ibatis.sqlmap.engine.type.CustomTypeHandler;
import com.ibatis.sqlmap.engine.type.JdbcTypeRegistry;
import com.ibatis.sqlmap.engine.type.TypeHandler;

@Repository("pagingSqlExecutor")
public class PagingSqlExecutor extends SqlExecutor {
	
	private static final Log logger = LogFactory.getLog(PagingSqlExecutor.class);
    
	@Resource(name="dialect")
    private Dialect dialect;
	
    private boolean enablePaging = true;
    
    private long totalCount = 0;
 
    public Dialect getDialect() {
        return dialect;
    }
 
    public void setDialect(Dialect dialect) {
        this.dialect = dialect;
    }

	public boolean isEnablePaging() {
		return enablePaging;
	}

	public void setEnablePaging(boolean enablePaging) {
		this.enablePaging = enablePaging;
	}
	
	public long getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(long totalCount) {
		this.totalCount = totalCount;
	}

	@Override
	public void executeQuery(StatementScope statementScope, Connection conn, 
			String sql, Object[] parameters, int skipResults, int maxResults, 
			RowHandlerCallback callback) throws SQLException {
		 /* if(logger.isDebugEnabled()){ logger.debug("---" + sql); }*/
//        if ((skipResults != NO_SKIPPED_RESULTS || maxResults != NO_MAXIMUM_RESULTS)
//                && supportsPaging()) {
//            String sqlCount = dialect.getTotalString(sql);
//            this.calcTotalCount(conn, sqlCount, statementScope.getParameterMap(), parameters);
//            //如果总数小于skipResults，则从第一笔开始取出
//            if (this.getTotalCount() < skipResults)
//            	skipResults = 1;
//            sql = dialect.getPagingString(sql, skipResults, maxResults);
//            skipResults = NO_SKIPPED_RESULTS;
//            maxResults = NO_MAXIMUM_RESULTS;
//        } else if(!sql.toLowerCase().contains("count(")){
//        	sql = dialect.getNormalString(sql);
//        }
        super.executeQuery(statementScope, conn, sql, parameters, skipResults,maxResults, callback);
        
    }
	
	public boolean supportsPaging() {
        if (enablePaging && dialect != null) {
            return dialect.supportsPaging();
        }
        return false;
    }

	private void calcTotalCount(Connection conn, String sql, ParameterMap parameterMap, Object[] parameters) {
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = conn.prepareStatement(sql);
			
			ParameterMapping[] parameterMappings = parameterMap.getParameterMappings();
			if (parameterMappings != null) {
		      for (int i = 0; i < parameterMappings.length; i++) {
		        ParameterMapping mapping = parameterMappings[i];
		        if (mapping.isInputAllowed()) {
		          setParameter(ps, mapping, parameters, i);
		        }
		      }
		    }
			
			rs = ps.executeQuery();
			if (rs.next()) {
				setTotalCount(rs.getLong(1));
			}
		} catch (SQLException e) {
			if(logger.isWarnEnabled()){
	            logger.warn("计算结果集总数出错，SQL---" + sql, e);
	        }
		} finally {
			try {
				if (rs != null) {
					rs.close();
					rs = null;
				}
				if (ps != null) {
					ps.close();
					ps = null;
				}
			} catch (SQLException e) {
				//ignore
			}
		}
	}
	
	private void setParameter(PreparedStatement ps, ParameterMapping mapping, Object[] parameters, int i) throws SQLException {
	    Object value = parameters[i];
	    // Apply Null Value
	    String nullValueString = mapping.getNullValue();
	    if (nullValueString != null) {
	      TypeHandler handler = mapping.getTypeHandler();
	      if (handler.equals(value, nullValueString)) {
	        value = null;
	      }
	    }

	    // Set Parameter
	    TypeHandler typeHandler = mapping.getTypeHandler();
	    if (value != null) {
	      typeHandler.setParameter(ps, i + 1, value, mapping.getJdbcTypeName());
	    } else if (typeHandler instanceof CustomTypeHandler) {
	      typeHandler.setParameter(ps, i + 1, value, mapping.getJdbcTypeName());
	    } else {
	      int jdbcType = mapping.getJdbcType();
	      if (jdbcType != JdbcTypeRegistry.UNKNOWN_TYPE) {
	        ps.setNull(i + 1, jdbcType);
	      } else {
	        ps.setNull(i + 1, Types.OTHER);
	      }
	    }
	  }
}
