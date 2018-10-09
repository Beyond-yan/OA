package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysInterfaceAccountDao;
import com.gdssoft.oa.model.system.SysInterfaceAccount;
import com.gdssoft.oa.service.system.SysInterfaceAccountService;

public class SysInterfaceAccountServiceImpl extends BaseServiceImpl<SysInterfaceAccount> implements SysInterfaceAccountService{
	@SuppressWarnings("unused")
	private SysInterfaceAccountDao dao;
	
	public SysInterfaceAccountServiceImpl(SysInterfaceAccountDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	public List<SysInterfaceAccount> getByAccount(Long id){
		return dao.getByAccount(id);
	}
	
	public int removeByAccount(Long id){
		return dao.removeByAccount(id);
	}

}