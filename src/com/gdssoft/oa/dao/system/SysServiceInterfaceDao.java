package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.system.SysServiceInterface;

/**
 * 
 * @author 
 *
 */
public interface SysServiceInterfaceDao extends BaseDao<SysServiceInterface>{
	/**
	 * 根据编号查询服务
	 * @param serviceCode
	 * @return
	 */
	public SysServiceInterface findServiceInterfaceByCode(String serviceCode);
}