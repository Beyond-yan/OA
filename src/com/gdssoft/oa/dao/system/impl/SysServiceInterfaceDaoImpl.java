package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysServiceInterfaceDao;
import com.gdssoft.oa.model.system.SysServiceInterface;

@SuppressWarnings("unchecked")
public class SysServiceInterfaceDaoImpl extends BaseDaoImpl<SysServiceInterface> implements SysServiceInterfaceDao{

	public SysServiceInterfaceDaoImpl() {
		super(SysServiceInterface.class);
	}
	/**
	 * 根据编号查询服务
	 * @param serviceCode
	 * @return
	 */
	public SysServiceInterface findServiceInterfaceByCode(String serviceCode){
		String hsql = "from SysServiceInterface si where si.serviceCode=:serviceCode";
		Query query = this.getSession().createQuery(hsql)
				.setParameter("serviceCode", serviceCode);
		List<SysServiceInterface> list = query.list();
		if(null != list && list.size()>0)
			return list.get(0);
		return null;
	}

}