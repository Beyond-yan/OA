package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysServiceAccountDao;
import com.gdssoft.oa.model.system.SysServiceAccount;

@SuppressWarnings("unchecked")
public class SysServiceAccountDaoImpl extends BaseDaoImpl<SysServiceAccount> implements SysServiceAccountDao{

	public SysServiceAccountDaoImpl() {
		super(SysServiceAccount.class);
	}
	/**
	 * 根据账号查询服务账号详细信息
	 */
	public SysServiceAccount getServiceAccount(String serviceAccount){
		String hsql = "from SysServiceAccount sa where sa.serviceAccount=:serviceAccount";
		Query q = getSession().createQuery(hsql).setParameter("serviceAccount", serviceAccount);
		List<SysServiceAccount> serviceAccountList = q.list();
		if(null != serviceAccountList && serviceAccountList.size()>0)
			return serviceAccountList.get(0);
		return null;
	}
	
	/**
	 * 根据账号查询服务账号详细信息
	 */
	public SysServiceAccount getServiceAccount(String serviceAccount,String serviceCode){
		String hsql = "select sa from SysServiceAccount sa join sa.sysInterfaceAccounts sia where sa.serviceAccount=:serviceAccount" +
				" and sia.sysServiceInterface.serviceCode=:serviceCode";
		Query q = getSession().createQuery(hsql).setParameter("serviceAccount", serviceAccount)
				.setParameter("serviceCode", serviceCode);
		List<SysServiceAccount> serviceAccountList = q.list();
		if(null != serviceAccountList && serviceAccountList.size()>0)
			return serviceAccountList.get(0);
		return null;
	}
}