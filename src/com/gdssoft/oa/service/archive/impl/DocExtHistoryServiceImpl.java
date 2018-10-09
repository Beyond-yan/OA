package com.gdssoft.oa.service.archive.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.archive.DocExtHistoryDao;
import com.gdssoft.oa.model.archive.DocExtHistory;
import com.gdssoft.oa.service.archive.DocExtHistoryService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class DocExtHistoryServiceImpl extends BaseServiceImpl<DocExtHistory> implements DocExtHistoryService{
	private DocExtHistoryDao dao;
	
	public DocExtHistoryServiceImpl(DocExtHistoryDao dao) {
		super(dao);
		this.dao=dao;
	}

}