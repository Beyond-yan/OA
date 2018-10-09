package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysServiceAccountDao;
import com.gdssoft.oa.model.system.SysServiceAccount;
import com.gdssoft.oa.service.system.SysServiceAccountService;

public class SysServiceAccountServiceImpl extends BaseServiceImpl<SysServiceAccount> implements SysServiceAccountService{
	@SuppressWarnings("unused")
	private SysServiceAccountDao dao;
	
	public SysServiceAccountServiceImpl(SysServiceAccountDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/**
	 * 根据账号查询服务账号详细信息
	 */
	public SysServiceAccount getServiceAccount(String serviceAccount){
		return dao.getServiceAccount(serviceAccount);
	}
	
	/**
	 * 根据账号查询服务账号详细信息
	 */
	public SysServiceAccount getServiceAccount(String serviceAccount,String serviceCode){
		return dao.getServiceAccount(serviceAccount, serviceCode);
	}

}