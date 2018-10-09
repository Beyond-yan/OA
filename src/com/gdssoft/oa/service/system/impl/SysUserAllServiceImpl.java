package com.gdssoft.oa.service.system.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysUserAllDao;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.model.system.SysUserAll;
import com.gdssoft.oa.service.system.SysUserAllService;

public class SysUserAllServiceImpl extends BaseServiceImpl<SysUserAll>
		implements SysUserAllService {
	@SuppressWarnings("unused")
	private SysUserAllDao dao;

	public SysUserAllServiceImpl(SysUserAllDao dao) {
		super(dao);
		this.dao = dao;
	}

	public SysUserAll findByUserName(String username) {
		return dao.findByUserName(username);
	}
	public SysSchemaConfig findSchemaByUserName(String username){
		return dao.findSchemaByUserName(username);
	}

	public void delUserByUserName(String userName){
		dao.delUserByUserName(userName);
	}
}