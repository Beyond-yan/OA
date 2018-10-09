package com.gdssoft.oa.service.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CarDriverDao;
import com.gdssoft.oa.model.admin.CarDriver;
import com.gdssoft.oa.service.admin.CarDriverService;

public class CarDriverServiceImpl extends BaseServiceImpl<CarDriver> implements CarDriverService{
	@SuppressWarnings("unused")
	private CarDriverDao dao;
	
	public CarDriverServiceImpl(CarDriverDao dao) {
		super(dao);
		this.dao=dao;
	}

}