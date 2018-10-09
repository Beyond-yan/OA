package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysArchivesFilesHisDao;
import com.gdssoft.oa.model.system.SysArchivesFilesHis;
import com.gdssoft.oa.service.system.SysArchivesFilesHisService;

public class SysArchivesFilesHisServiceImpl extends BaseServiceImpl<SysArchivesFilesHis> implements SysArchivesFilesHisService{
	@SuppressWarnings("unused")
	private SysArchivesFilesHisDao dao;
	
	public SysArchivesFilesHisServiceImpl(SysArchivesFilesHisDao dao) {
		super(dao);
		this.dao=dao;
	}

}