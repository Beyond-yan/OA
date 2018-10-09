package com.gdssoft.oa.dao.common;

public interface Dialect {
	public boolean supportsPaging();
	 
    //public String getPagingString(String sql, boolean hasOffset);

    public String getNormalString(String sql);
    
    public String getPagingString(String sql, int skipResults, int maxResults);
    
    public String getTotalString(String sql);
}
