package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import com.gdssoft.oa.dao.system.SystemLogDao;
import com.gdssoft.oa.model.system.SystemLog;
import com.gdssoft.oa.service.system.SystemLogService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class SystemLogServiceImpl extends BaseServiceImpl<SystemLog> implements SystemLogService{
	private SystemLogDao dao;
	
	public SystemLogServiceImpl(SystemLogDao dao) {
		super(dao);
		this.dao=dao;
	}

}