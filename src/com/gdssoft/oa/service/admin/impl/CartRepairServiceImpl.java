package com.gdssoft.oa.service.admin.impl;

/*
 *   捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CartRepairDao;
import com.gdssoft.oa.model.admin.Car;
import com.gdssoft.oa.model.admin.CartRepair;
import com.gdssoft.oa.service.admin.CarService;
import com.gdssoft.oa.service.admin.CartRepairService;

public class CartRepairServiceImpl extends BaseServiceImpl<CartRepair>
		implements CartRepairService {
	@SuppressWarnings("unused")
	private CartRepairDao dao;

	private CarService carService;

	public void setCarService(CarService carService) {
		this.carService = carService;
	}

	public CartRepairServiceImpl(CartRepairDao dao) {
		super(dao);
		this.dao = dao;
	}

	@Override
	public void updateCarStatus(Long carId, Integer repairType) {
		// TODO Auto-generated method stub
		Car car = carService.get(carId);
		car.setStatus(new Short(String.valueOf(repairType)));
		carService.save(car);
	}

	/**
	 * 
	 * 获取有外键关联的维修车辆
	 * 
	 * @param cartRepair
	 * @return
	 */
	public List<CartRepair> getCarRepairs(CartRepair cartRepair) {
		return dao.getCarRepairs(cartRepair);
	}

	@Override
	public void updateCarStatus(Long carId) {
		// TODO Auto-generated method stub
		Car car = carService.get(carId);
		car.setStatus(new Short("1"));
		carService.save(car);
	}
}