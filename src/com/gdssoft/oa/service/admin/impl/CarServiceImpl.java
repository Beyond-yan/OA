package com.gdssoft.oa.service.admin.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.Date;
import java.util.List;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CarDao;
import com.gdssoft.oa.model.admin.Car;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.admin.CarInsurance;
import com.gdssoft.oa.model.admin.CartRepair;
import com.gdssoft.oa.service.admin.CarApplyService;
import com.gdssoft.oa.service.admin.CarInsuranceService;
import com.gdssoft.oa.service.admin.CarService;
import com.gdssoft.oa.service.admin.CartRepairService;

public class CarServiceImpl extends BaseServiceImpl<Car> implements CarService {
	@SuppressWarnings("unused")
	private CarDao dao;

	private CarInsuranceService carInsuranceService;

	private CartRepairService cartRepairService;

	private CarApplyService carApplyService;

	public void setCarApplyService(CarApplyService carApplyService) {
		this.carApplyService = carApplyService;
	}

	public void setCartRepairService(CartRepairService cartRepairService) {
		this.cartRepairService = cartRepairService;
	}
	public List<Car> getCarVilabe(Date startDate,Date endDate, int size, int start){
	    return dao.getCarVilabe( startDate, endDate,size, start);
	    }
	@Override
	public Long count(Date startDate,Date endDate){
		return dao.count(startDate, endDate);
	}
	
	public void setCarInsuranceService(CarInsuranceService carInsuranceService) {
		this.carInsuranceService = carInsuranceService;
	}

	public CarServiceImpl(CarDao dao) {
		super(dao);
		this.dao = dao;
	}

	@Override
	public void saveCarInsurance(CarInsurance carInsurance) {
		// TODO Auto-generated method stub
		carInsuranceService.save(carInsurance);
	}

	@Override
	public void delCarForCarInsurance(QueryFilter filter) {
		// TODO Auto-generated method stub
		List<CarInsurance> carInsurances = carInsuranceService.getAll(filter);
		if (carInsurances != null && carInsurances.size() > 0) {
			carInsuranceService.remove(carInsurances.get(0));
		}
	}

	@Override
	public void delCarForCarRepair(QueryFilter filter) {
		// TODO Auto-generated method stub
		List<CartRepair> cartRepairs = cartRepairService.getAll(filter);
		if (cartRepairs != null && cartRepairs.size() > 0) {
			cartRepairService.remove(cartRepairs.get(0));
		}
	}

	public void delCarForCarApply(QueryFilter filter) {
		// TODO Auto-generated method stub
		List<CarApply> carApplies = carApplyService.getAll(filter);
		if (carApplies != null && carApplies.size() > 0) {
			carApplyService.remove(carApplies.get(0));
		}
	}

	@Override
	public List<Car> getUserFullCars(Short status) {
		// TODO Auto-generated method stub
		return dao.getUserFullCars(status);
	}

	@Override
	public List<Car> getListCars(String carno) {
		// TODO Auto-generated method stub
		return dao.getListCars(carno);
	}

}