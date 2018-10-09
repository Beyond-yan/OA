package com.gdssoft.oa.service.admin.impl;

/*
 *   捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CarApplyDao;
import com.gdssoft.oa.dao.flow.TaskDao;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.admin.CarDriver;
import com.gdssoft.oa.service.admin.CarApplyService;

public class CarApplyServiceImpl extends BaseServiceImpl<CarApply> implements
		CarApplyService {
	@SuppressWarnings("unused")
	private CarApplyDao dao;
	@Resource
    private TaskDao taskDao;
    
	public CarApplyServiceImpl(CarApplyDao dao) {
		super(dao);
		this.dao = dao;
	}

	@Override
	public List<CarApply> getUselessCar(Date startDate, Date endDate) {
		// TODO Auto-generated method stub
		return dao.getUselessCar(startDate, endDate);
	}
	/*public List<CarApply> getCarVilabe(Date startDate, Date endDate) {
		// TODO Auto-generated method stub
		return dao.getCarVilabe(startDate, endDate);
	}*/
	@Override
	public List<CarApply> getCars() {
		// TODO Auto-generated method stub
		return dao.getCars();
	}

	@Override
	public List<CarApply> getDateCar(Date startDate, Date endDate) {
		// TODO Auto-generated method stub
		return dao.getDateCar(startDate, endDate);
	}

	@Override
	public List<CarApply> getUserFullCar(Long carId, Date date, Boolean use) {
		// TODO Auto-generated method stub
		return dao.getUserFullCar(carId, date,use);
	}

	@Override
	public List<CarApply> getIsUserCar(Long carId, Long applyId) {
		// TODO Auto-generated method stub
		return dao.getIsUserCar(carId, applyId);
	}

	@Override
	public List<CarApply> getApplyCars(Long carId) {
		// TODO Auto-generated method stub
		return dao.getApplyCars(carId);
	}

	@Override
	public CarApply getCarApplyByRunId(Long runId) {
		// TODO Auto-generated method stub
		return dao.getCarApplyByRunId(runId);
	}

	@Override
	public Long count(Date startDate, Date endDate){	
		return dao.count(startDate, endDate);
	}
	
	@Override
	public List<CarDriver> getCarDriverVilabe(Date startDate, Date endDate, int size,
			int start){
		return dao.getCarDriverVilabe(startDate, endDate, size, start);
	}
	@Override
	public List<CarApply> usefind(int status,int status2, String createBy,String carNo, Date sdt, Date edt,int userId,int operatorId,
			int size, int start){
		return dao.usefind(status,status2, createBy, carNo, sdt, edt,userId,operatorId, size, start);
	}
	@Override
	public Long usecount(int status,int status2, String createBy,String carNo, Date sdt, Date edt,int userId,int operatorId){
		return dao.usecount(status,status,createBy, carNo, userId,operatorId,sdt, edt);
	}
	@Override
	public List<CarApply> gettask(List<CarApply> carapplyList) {
		for(CarApply apply : carapplyList){
			if(null == apply.getProcessRun()) continue;
			if(null!=apply.getProcessRun().getPiId()){
			TaskImpl task = taskDao.getTasks(apply.getProcessRun().getPiId());
			TaskImpl taskTemp = new TaskImpl();
				taskTemp.setExecutionDbid(task.getDbid());
				taskTemp.setActivityName(task.getActivityName());
				taskTemp.setName(task.getName());
				apply.setTask(taskTemp);
			}
		}
		return carapplyList;
	}
	/**
	 * 车况参考
	 */
	public Long carConditionReferCount(int status, String carNo, Date sdt,Date edt){
		return dao.carConditionReferCount(status, carNo, sdt, edt);
	}
	public List<CarApply> carConditionRefer(int status, String carNo, Date sdt,
			Date edt, int size, int start){
		return dao.carConditionRefer(status,  carNo, sdt, edt, size, start);
	}
}