package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.archive.CommonUnitsDao;
import com.gdssoft.oa.model.archive.CommonUnits;

@SuppressWarnings("unchecked")
public class CommonUnitsDaoImpl extends BaseDaoImpl<CommonUnits> implements CommonUnitsDao{

	public CommonUnitsDaoImpl() {
		super(CommonUnits.class);
	}
	public List<CommonUnits>  getUnitsForSelector(String unitName,Short unitType,PagingBean pb){
		if(unitName==null||unitName.equals("")){
			String hql = "select cu from CommonUnits cu where cu.unitType=?";
			Object[] objs = { unitType};
		return findByHql(hql, objs, pb);
		}else{
			String hql = "select cu from CommonUnits cu where cu.unitName like '%'+?+'%' and cu.unitType=?";
			Object[] objs = { unitName,unitType};
			return findByHql(hql, objs, pb);
		}
	}
}