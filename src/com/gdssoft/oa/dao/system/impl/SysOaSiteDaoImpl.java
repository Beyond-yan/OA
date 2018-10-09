package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysOaSiteDao;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.model.system.SysOaSite;

@SuppressWarnings("unchecked")
public class SysOaSiteDaoImpl extends BaseDaoImpl<SysOaSite> implements SysOaSiteDao{

	public SysOaSiteDaoImpl() {
		super(SysOaSite.class);
	}
	
	/**
	 * 判断是否已存在本站点
	 */
	public List<SysOaSite> haveOwner(Long id){
		ArrayList<Object> paramList = new ArrayList<Object>();
		String hql = " from SysOaSite so where so.ownerType = 1";
		hql += " and so.id != ?";
		paramList.add(id);
		List<SysOaSite> list = findByHql(hql, paramList.toArray());
		return list;
	}
	public List<SysOaSite> haveOwner(){
		ArrayList<Object> paramList = new ArrayList<Object>();
		String hql = " from SysOaSite so where so.ownerType = 1";
		List<SysOaSite> list = findByHql(hql, paramList.toArray());
		return list;
	}

}