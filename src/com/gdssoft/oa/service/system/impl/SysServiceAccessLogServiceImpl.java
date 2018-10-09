package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysServiceAccessLogDao;
import com.gdssoft.oa.model.system.SysServiceAccessLog;
import com.gdssoft.oa.service.system.SysServiceAccessLogService;

public class SysServiceAccessLogServiceImpl extends BaseServiceImpl<SysServiceAccessLog> implements SysServiceAccessLogService{
	@SuppressWarnings("unused")
	private SysServiceAccessLogDao dao;
	
	public SysServiceAccessLogServiceImpl(SysServiceAccessLogDao dao) {
		super(dao);
		this.dao=dao;
	}

}