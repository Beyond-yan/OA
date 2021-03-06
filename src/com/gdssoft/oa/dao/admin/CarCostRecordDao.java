package com.gdssoft.oa.dao.admin;

import java.util.Date;
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.admin.CarCostRecord;

public interface CarCostRecordDao extends BaseDao<CarCostRecord> {

	public List<CarCostRecord> selectByCostType(Date startDate, Date endDate,int start,int size);
	
	public List<CarCostRecord> selectByCostDate(Date startDate, Date endDate,int start,int size,String selectBy);
	
	public Long count(Date startDate,Date endDate);
	
	public List<CarCostRecord> selectByCarAndTime(Date startDate, Date endDate,int start,int size);

	public Long countByTypeName(Date startDate,Date endDate);
	
	public Long countByCostDate(Date startDate,Date endDate,String selectBy);
	
	public List<CarCostRecord> selectByCarAndType(Date startDate, Date endDate,int start,int size);
	
	public Long countByCarAndType(Date startDate,Date endDate);
	
	public List<CarCostRecord> costStatistics(Date startDate, Date endDate,String selectBy,String carIds);
	
	public Float totalAmtSumTypeName(Date startDate, Date endDate);
	
	public Float totalSumCarAndTime(Date startDate, Date endDate);
	
	public Float totalSumCostDate(Date startDate, Date endDate,String selectBy);
	
	public Float totalSumCarAndType(Date startDate, Date endDate);
}
