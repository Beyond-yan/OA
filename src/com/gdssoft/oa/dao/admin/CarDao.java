package com.gdssoft.oa.dao.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.Date;
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.admin.Car;

/**
 * 
 * @author
 * 
 */
public interface CarDao extends BaseDao<Car> {
	/**
	 * 
	 * 获取被申请的车辆
	 * 
	 * @param status
	 * @return
	 */
	public List<Car> getUserFullCars(Short status);
    public List<Car> getCarVilabe(Date startDate, Date endDate, int size, int start);
	/**
	 * 
	 * 根据车辆的号牌来查询
	 * 
	 * @param carno
	 * @return
	 */
	public List<Car> getListCars(String carno);
	public  Long count(Date startDate, Date endDate);
	
}