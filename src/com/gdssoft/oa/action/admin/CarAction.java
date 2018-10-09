package com.gdssoft.oa.action.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen GDS Software Limited Company.
 */
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.Car;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.admin.CarInsurance;
import com.gdssoft.oa.model.admin.CarOilCard;
import com.gdssoft.oa.model.admin.CarPassFeeCard;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.admin.CarApplyService;
import com.gdssoft.oa.service.admin.CarOilCardService;
import com.gdssoft.oa.service.admin.CarPassFeeCardService;
import com.gdssoft.oa.service.admin.CarService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class CarAction extends BaseAction {
	@Resource
	private CarService carService;
	@Resource
	private CarApplyService carApplySerive;
	@Resource
	private CarOilCardService carOilCardService;
	@Resource
	private CarPassFeeCardService carPassFeeCardService;
	private Car car;
	private Department department;

	public CarApplyService getCarApplySerive() {
		return carApplySerive;
	}

	public void setCarApplySerive(CarApplyService carApplySerive) {
		this.carApplySerive = carApplySerive;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	private Long carid;

	public Long getCarid() {
		return carid;
	}

	public CarService getCarService() {
		return carService;
	}

	public void setCarService(CarService carService) {
		this.carService = carService;
	}

	public void setCarid(Long carid) {
		this.carid = carid;
	}

	public Car getCar() {
		return car;
	}

	public void setCar(Car car) {
		this.car = car;
	}

	public void setCarOilCardService(CarOilCardService carOilCardService) {
		this.carOilCardService = carOilCardService;
	}

	public void setCarPassFeeCardService(
			CarPassFeeCardService carPassFeeCardService) {
		this.carPassFeeCardService = carPassFeeCardService;
	}

	/**
	 * 显示查询时间内符合条件的车辆
	 */
	public String listInTime() {
		Date sdt = null;
		Date edt = null;
		int status = 9;
		if (getRequest().getParameter("status") != null
				&& !"".equals(getRequest().getParameter("status"))) {
			status = Integer.parseInt(getRequest().getParameter("status"));
		}
		int status2 = 9;
		if (getRequest().getParameter("status2") != null
				&& !"".equals(getRequest().getParameter("status2"))) {
			status2 = Integer.parseInt(getRequest().getParameter("status2"));
		}
		String carNo="";
		if(getRequest().getParameter("carNo")!=null&& !"".equals(carNo));
		 carNo =getRequest().getParameter("carNo");
		 String createBy="";
			if(getRequest().getParameter("createBy")!=null&& !"".equals(createBy));
			createBy =getRequest().getParameter("createBy");
		int userId=-888;
			if (getRequest().getParameter("userId") != null
					&& !"".equals(getRequest().getParameter("userId"))) {
				userId = Integer.parseInt(getRequest().getParameter("userId"));
			}
			int operatorId=-888;
			if (getRequest().getParameter("operatorId") != null
					&& !"".equals(getRequest().getParameter("operatorId"))) {
				operatorId = Integer.parseInt(getRequest().getParameter("operatorId"));
			}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String startDate = getRequest().getParameter("startTime");
		String endDate = getRequest().getParameter("endTime");
		if (startDate != null && !"".equals(startDate)) {
			try {
				sdt = sdf.parse(startDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		if (endDate != null && !"".equals(endDate)) {
			try {
				edt = sdf.parse(endDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		int size = Integer.parseInt(getRequest().getParameter("limit"));
		int start = Integer.parseInt(getRequest().getParameter("start"));
		List<CarApply> list = carApplySerive.usefind(status,status2,createBy ,carNo, sdt, edt,userId,operatorId ,size, start);
		Long con = carApplySerive.usecount(status,status2,createBy ,carNo, sdt, edt,userId,operatorId);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(con).append(",result:");
		JSONSerializer json = JsonUtil.getJSONSerializer("createDate",
				"updateDate");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "startTime");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "endTime");
		buff.append(json.exclude(new String[] { "class", "appUser.password" })
				.serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}
	/**
	 * 显示列表且带是否可用状态
	 */
	public String listHasStatus() {
		Date sdt = null;
		Date edt = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String sd = getRequest().getParameter("startTime");
		String ed = getRequest().getParameter("endTime");
		if (sd != null && !"".equals(sd)) {
			try {
				String startDate = sd + ":00";
				sdt = sdf.parse(startDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		if (ed != null && !"".equals(ed)) {
			try {
				String endDate = ed + ":00";
				edt = sdf.parse(endDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		int status =-1;
		if(null!=getRequest().getParameter("status")&&!getRequest().getParameter("status").equals("")){
			status=Integer.parseInt(getRequest().getParameter("status"));
		}	
		String carNo="";
		if(getRequest().getParameter("carNo")!=null&& !"".equals(carNo));{
		 carNo =getRequest().getParameter("carNo");
		 }
		int size = Integer.parseInt(getRequest().getParameter("limit"));
		int start = Integer.parseInt(getRequest().getParameter("start"));	
		Long count=carApplySerive.carConditionReferCount(status, carNo, sdt, edt);
		List<CarApply> listCanUsed=carApplySerive.carConditionRefer(status, carNo, sdt, edt, size, start);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(count).append(
						",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"), new String[] {
				"startTime", "endTime"});
		buff.append(serializer.exclude(new String[] { "class" }).serialize(listCanUsed));
		buff.append("}");
	
		jsonString = buff.toString();
		return SUCCESS;
	}
	
	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		if (car != null && car.getStatus() != null) {
			filter.addFilter("Q_status_SN_EQ", String.valueOf(car.getStatus()));
		}
		List<Car> list = carService.getAll(filter);
        for(Car car:list){
        	if(car.getDepartment()==null){
        		Department department=new Department();
        		car.setDepartment(department);
        	}
        }
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"buyinsuretime", "audittime", "buydate", "createDate",
				"updateDate" });
		buff.append(serializer.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				Car car = carService.get(Long.valueOf(id));
				System.out
						.println("-----car.getStatus()----" + car.getStatus());
				// 车辆状态为 已申请 不能被删除
				if (car.getStatus() == 3) {
					setJsonString("{result:1}");
					return SUCCESS;
				}
				QueryFilter filter = new QueryFilter(getRequest());
				filter.addFilter("Q_car.id_L_EQ", id);
				carService.delCarForCarInsurance(filter);
				carService.delCarForCarRepair(filter);
				carService.delCarForCarApply(filter);
				carService.remove(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		Car car = carService.get(carid);
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer json = JsonUtil.getJSONSerializer("createtime",
				"updatetime");
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"buyinsuretime", "audittime", "buydate" });
		sb.append(json.include("department.depName").exclude(new String[] { "class","department" }).serialize(car));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		if (car.getCarid() == null) {
			if (car.getCarno() != null) {
				// 判断车牌是否唯一
				QueryFilter filter = new QueryFilter(getRequest());
				filter.addFilter("Q_carno_S_EQ", car.getCarno());
				if (carService.getAll(filter).size() > 0) {
					setJsonString("{result:1}");

					return SUCCESS;
				}
			}
			car.setCreateDate(new Date());
			car.setUpdateDate(new Date());
			AppUser currentUser = ContextUtil.getCurrentUser();
			car.setCreateBy(currentUser.getUsername());
			car.setUpdateBy(currentUser.getUsername());
			if(car.getDepartment().getDepId()==null){
				car.setDepartment(null);
			}
			carService.save(car);
			if (car.getBuyinsuretime() != null) {
				CarInsurance carInsurance = new CarInsurance();
				carInsurance.setBuyDate(car.getBuyinsuretime());
				carInsurance.setCarId(car.getCarid());
				carService.saveCarInsurance(carInsurance);
			}
		} else {
			Car orgCar = carService.get(car.getCarid());
			// 如果修改了车牌号，判断是否已存在
			if(!(orgCar.getCarno()==car.getCarno()||orgCar.getCarno().equals(car.getCarno()))){
				QueryFilter filter = new QueryFilter(getRequest());
				filter.addFilter("Q_carno_S_EQ", car.getCarno());
				if (carService.getAll(filter).size() > 0) {
					setJsonString("{result:1}");
					return SUCCESS;
				}
			}
			if(car.getDepartment().getDepId()==null){
				Department deo=new Department();
				car.setDepartment(deo);
			}
			try {
				BeanUtil.copyNotNullProperties(orgCar, car);
				if(car.getDepartment().getDepId()==null){
					Department deo=null;
					orgCar.setDepartment(deo);
				}
				carService.save(orgCar);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}
	public String updatecar() {
		String[] ids = getRequest().getParameterValues("ids");
		Car car = null;
		if (ids != null) {
			for (String id : ids) {
				car = carService.get(new Long(id));
				if (null == car)
					continue;
				car.setIsPublic("1");
				car.setUpdateDate(new Date());
				car.setUpdateBy(ContextUtil.getCurrentUser()
						.getUsername());
				carService.save(car);
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}
	/**
	 * 删除图片
	 */
	public String delphoto() {
		String strCarId = getRequest().getParameter("carid");
		if (StringUtils.isNotEmpty(strCarId)) {
			car = carService.get(new Long(strCarId));
			car.setCartimage("");
			carService.save(car);
			setJsonString("{success:true}");
		}
		return SUCCESS;
	}
}
