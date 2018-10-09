package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.archive.DocExtHistoryDao;
import com.gdssoft.oa.model.archive.DocExtHistory;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class DocExtHistoryDaoImpl extends BaseDaoImpl<DocExtHistory> implements DocExtHistoryDao{

	public DocExtHistoryDaoImpl() {
		super(DocExtHistory.class);
	}

}