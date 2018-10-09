package com.gdssoft.oa.service.admin;

/*
 *   捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.admin.CarDriver;
import com.gdssoft.oa.model.archive.Archives;

public interface CarApplyService extends BaseService<CarApply> {
	/**
	 * 
	 * 获取在这个时间段的申请车辆
	 * 
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public List<CarApply> getUselessCar(Date startDate, Date endDate);

	public List<CarApply> getCars();

	/**
	 * 
	 * 获取申请日期相同的车辆
	 * 
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public List<CarApply> getDateCar(Date startDate, Date endDate);
	
/*	public List<CarApply> getCarVilabe(Date startDate, Date endDate);*/

	/**
	 * 
	 * 获取这辆车还没有过去的申请记录
	 * 
	 * @param carId
	 * @param date
	 * @return
	 */
	public List<CarApply> getUserFullCar(Long carId, Date date, Boolean use);

	/**
	 * 
	 * 查看这辆车是否已被申请
	 * 
	 * @param carId
	 * @param applyId
	 * @return
	 */
	public List<CarApply> getIsUserCar(Long carId, Long applyId);

	/**
	 * 
	 * 获取这辆车的申请记录
	 * 
	 * @param carId
	 * @return
	 */
	public List<CarApply> getApplyCars(Long carId);
	
	/**
	 * 通过流程实例Id获得公文对象实体
	 * @return
	 */
	public CarApply getCarApplyByRunId(Long runId);

	public Long count(Date startDate, Date endDate);
	public List<CarDriver> getCarDriverVilabe(Date startDate, Date endDate, int size,
			int start);
	public List<CarApply> usefind(int status,int status2,String createBy, String carNo, Date sdt, Date edt,int userId,int operatorId,
			int size, int start);
	public Long usecount(int status,int status2,String createBy, String carNo, Date sdt, Date edt,int userId,int operatorId);

	public   List<CarApply> gettask(List<CarApply> carapplyList);
	/**
	 * 车况参考
	 */
	public Long carConditionReferCount(int status,String carNo, Date sdt,Date edt);
	public List<CarApply> carConditionRefer(int status, String carNo, Date sdt,
			Date edt, int size, int start);
}
