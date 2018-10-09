package com.gdssoft.oa.service.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.Date;
import java.util.List;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.admin.Car;
import com.gdssoft.oa.model.admin.CarInsurance;

public interface CarService extends BaseService<Car> {

	/**
	 * 
	 * 保存车辆保险
	 * 
	 * @param carInsurance
	 */
	public void saveCarInsurance(CarInsurance carInsurance);

	/**
	 * 
	 * 删除关联了保险的车辆
	 * 
	 * @param carId
	 */
	public void delCarForCarInsurance(QueryFilter filter);
	/**
	 * 
	 * 删除了关联维修的车辆
	 * 
	 * @param carId
	 */
	public void delCarForCarRepair(QueryFilter filter);

	/**
	 * 
	 * 删除关联申请的车辆
	 * 
	 * @param filter
	 */
	public void delCarForCarApply(QueryFilter filter);
	
	/**
	 * 
	 * 获取被申请的车辆
	 * 
	 * @param status
	 * @return
	 */
	public List<Car> getUserFullCars(Short status);
	/**
	 * 
	 * 根据车辆的号牌来查询
	 * 
	 * @param carno
	 * @return
	 */
	public List<Car> getListCars(String carno);

	Long count(Date startDate, Date endDate);

	List<Car> getCarVilabe(Date startDate, Date endDate, int size, int start);
}
