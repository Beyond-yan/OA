package com.gdssoft.oa.dao.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.CarDriverDao;
import com.gdssoft.oa.model.admin.CarDriver;

@SuppressWarnings("unchecked")
public class CarDriverDaoImpl extends BaseDaoImpl<CarDriver> implements CarDriverDao{

	public CarDriverDaoImpl() {
		super(CarDriver.class);
	}

}