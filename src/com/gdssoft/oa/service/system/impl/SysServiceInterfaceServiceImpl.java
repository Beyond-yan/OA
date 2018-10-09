package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SysServiceInterfaceDao;
import com.gdssoft.oa.model.system.SysServiceInterface;
import com.gdssoft.oa.service.system.SysServiceInterfaceService;

public class SysServiceInterfaceServiceImpl extends BaseServiceImpl<SysServiceInterface> implements SysServiceInterfaceService{
	@SuppressWarnings("unused")
	private SysServiceInterfaceDao dao;
	
	public SysServiceInterfaceServiceImpl(SysServiceInterfaceDao dao) {
		super(dao);
		this.dao=dao;
	}
	/**
	 * 根据编号查询服务
	 * @param serviceCode
	 * @return
	 */
	public SysServiceInterface findServiceInterfaceByCode(String serviceCode){
		return dao.findServiceInterfaceByCode(serviceCode);
	}

}