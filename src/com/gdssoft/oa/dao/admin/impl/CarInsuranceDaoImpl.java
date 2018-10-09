package com.gdssoft.oa.dao.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.CarInsuranceDao;
import com.gdssoft.oa.model.admin.CarInsurance;
import com.gdssoft.oa.model.admin.CartRepair;

@SuppressWarnings("unchecked")
public class CarInsuranceDaoImpl extends BaseDaoImpl<CarInsurance> implements CarInsuranceDao{

	public CarInsuranceDaoImpl() {
		super(CarInsurance.class);
	}
	private String getCarInsurance(CarInsurance carInsurance) {
		Long carId = null;

		carId = carInsurance.getCarId();

		return " from CarInsurance u where 1=1 "
				+ (carId != null ? " and u.car.id = " + carId : "");

	}

	public List<CarInsurance> getCarInsurances(CarInsurance carInsurance) {
		return find(getCarInsurance(carInsurance), null, 1, 1);
	}
}