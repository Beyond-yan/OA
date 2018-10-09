package com.gdssoft.oa.dao.admin.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.CarDao;
import com.gdssoft.oa.model.admin.Car;

@SuppressWarnings("unchecked")
public class CarDaoImpl extends BaseDaoImpl<Car> implements CarDao {

	public CarDaoImpl() {
		super(Car.class);
	}

	public List<Car> getUserFullCars(Short status) {
		String sql = " from Car c where c.status=? ";
		return findByHql(sql, new Object[] { status });
	}
	
	public List<Car> getListCars(String carno) {
		String sql = " from Car c where c.carno like '%"+carno+"%' ";
		return findByHql(sql);
	}
	
	@Override
	public Long count(Date startDate,Date endDate) {
		String sql = "SELECT count(*) FROM car a WHERE  status not in(0,5,2) AND NOT EXISTS (" +
				"SELECT CAR_NO FROM car_apply " +
				"WHERE car_no IS NOT NULL AND car_no = a.carno   AND ((endtime > :edt AND starttime <= :edt) " +
				"OR (endtime > :sta AND starttime <= :sta)))";	
		Query q = getSession().createSQLQuery(sql)
				.setParameter("sta", startDate)
				.setParameter("edt", endDate);
		BigDecimal count = null;
		List olist = q.list();
		if(olist!=null){
			count = (BigDecimal)olist.get(0);
		}
		return count.longValue();
	}
	@Override
	public List<Car> getCarVilabe(Date startDate,Date endDate,int size,int start) {
		
		String sql ="SELECT {a.*} FROM (" 
				+"SELECT rownum as RN0,a.* FROM car a WHERE  status not in(0,5,2) AND NOT EXISTS (" +
				"SELECT CAR_NO FROM car_apply " +
				"WHERE car_no IS NOT NULL  AND car_no = a.carno   AND ((endtime > :edt AND starttime <= :edt) " +
				"OR (endtime > :sta AND starttime <= :sta)))) a WHERE RN0<=:end and RN0>:start";	
		Query q = getSession().createSQLQuery(sql)
				.addEntity("a", Car.class)
				.setParameter("sta", startDate)
				.setParameter("edt", endDate)
		       .setParameter("start", start)
		     .setParameter("end", start+size);
        return q.list();
	}
	
}