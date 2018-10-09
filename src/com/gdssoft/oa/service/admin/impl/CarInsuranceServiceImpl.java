package com.gdssoft.oa.service.admin.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CarInsuranceDao;
import com.gdssoft.oa.model.admin.CarInsurance;
import com.gdssoft.oa.service.admin.CarInsuranceService;

public class CarInsuranceServiceImpl extends BaseServiceImpl<CarInsurance>
		implements CarInsuranceService {
	@SuppressWarnings("unused")
	private CarInsuranceDao dao;

	public CarInsuranceServiceImpl(CarInsuranceDao dao) {
		super(dao);
		this.dao = dao;
	}

	@Override
	public List<CarInsurance> getCarInsurances(CarInsurance carInsurance) {
		// TODO Auto-generated method stub
		return dao.getCarInsurances(carInsurance);
	}

}