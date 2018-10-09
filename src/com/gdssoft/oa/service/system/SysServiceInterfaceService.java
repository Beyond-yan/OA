package com.gdssoft.oa.service.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.system.SysServiceInterface;

public interface SysServiceInterfaceService extends BaseService<SysServiceInterface>{
	/**
	 * 根据编号查询服务
	 * @param serviceCode
	 * @return
	 */
	public SysServiceInterface findServiceInterfaceByCode(String serviceCode);
}


