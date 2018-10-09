package com.gdssoft.oa.service.archive.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.archive.DocHistoryDao;
import com.gdssoft.oa.model.archive.DocHistory;
import com.gdssoft.oa.service.archive.DocHistoryService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class DocHistoryServiceImpl extends BaseServiceImpl<DocHistory> implements DocHistoryService{
	private DocHistoryDao dao;
	
	public DocHistoryServiceImpl(DocHistoryDao dao) {
		super(dao);
		this.dao=dao;
	}

}