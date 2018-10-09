package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.archive.RepairRecArchiveDao;
import com.gdssoft.oa.model.archive.RepairRecArchive;
import com.gdssoft.oa.service.archive.RepairRecArchiveService;

public class RepairRecArchiveServiceImpl extends BaseServiceImpl<RepairRecArchive> implements RepairRecArchiveService{
	
	private RepairRecArchiveDao dao;
	
	public RepairRecArchiveServiceImpl(RepairRecArchiveDao dao) {
		super(dao);
		this.dao=dao;
	}

}