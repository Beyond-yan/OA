package com.gdssoft.oa.service.admin.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CarUsingDao;
import com.gdssoft.oa.model.admin.CarUsing;
import com.gdssoft.oa.service.admin.CarUsingService;

public class CarUsingServiceImpl extends BaseServiceImpl<CarUsing> implements
		CarUsingService {
	@SuppressWarnings("unused")
	private CarUsingDao dao;

	public CarUsingServiceImpl(CarUsingDao dao) {
		super(dao);
		this.dao = dao;
	}

	@Override
	public CarUsing checkCarStatus(Long carId, Long carApplyId) {
		// TODO Auto-generated method stub
		return dao.checkCarStatus(carId, carApplyId);
	}

	@Override
	public int getCarUsingCount(Long carApplyId) {
		// TODO Auto-generated method stub
		return dao.getCarUsingCount(carApplyId);
	}

}