package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysServiceAccessLogDao;
import com.gdssoft.oa.model.system.SysServiceAccessLog;

@SuppressWarnings("unchecked")
public class SysServiceAccessLogDaoImpl extends BaseDaoImpl<SysServiceAccessLog> implements SysServiceAccessLogDao{

	public SysServiceAccessLogDaoImpl() {
		super(SysServiceAccessLog.class);
	}

}