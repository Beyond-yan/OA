package com.gdssoft.oa.service.snconfig.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.snconfig.FileSnConfigHistoryDao;
import com.gdssoft.oa.model.snconfig.FileSnConfigHistory;
import com.gdssoft.oa.service.snconfig.FileSnConfigHistoryService;

public class FileSnConfigHistoryServiceImpl extends BaseServiceImpl<FileSnConfigHistory> implements FileSnConfigHistoryService{
	@SuppressWarnings("unused")
	private FileSnConfigHistoryDao dao;
	
	public FileSnConfigHistoryServiceImpl(FileSnConfigHistoryDao dao) {
		super(dao);
		this.dao=dao;
	}

}