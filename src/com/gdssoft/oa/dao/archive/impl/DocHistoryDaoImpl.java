package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.archive.DocHistoryDao;
import com.gdssoft.oa.model.archive.DocHistory;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class DocHistoryDaoImpl extends BaseDaoImpl<DocHistory> implements DocHistoryDao{

	public DocHistoryDaoImpl() {
		super(DocHistory.class);
	}

}