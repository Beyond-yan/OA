package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.system.SysServiceAccount;

/**
 * 
 * @author 
 *
 */
public interface SysServiceAccountDao extends BaseDao<SysServiceAccount>{
	/**
	 * 根据账号查询服务账号详细信息
	 */
	public SysServiceAccount getServiceAccount(String serviceAccount);
	/**
	 * 根据账号查询服务账号详细信息
	 */
	public SysServiceAccount getServiceAccount(String serviceAccount,String serviceCode);
}