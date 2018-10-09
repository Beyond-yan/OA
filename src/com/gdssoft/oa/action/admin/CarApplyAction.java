package com.gdssoft.oa.action.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.job.DateUtil2;
import com.gdssoft.oa.job.ParamMap;
import com.gdssoft.oa.model.admin.Car;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.admin.CarDriver;
import com.gdssoft.oa.model.admin.CarUsing;
import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.admin.CarApplyService;
import com.gdssoft.oa.service.admin.CarDriverService;
import com.gdssoft.oa.service.admin.CarService;
import com.gdssoft.oa.service.admin.CarUsingService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.info.ShortMessageService;
import com.gdssoft.oa.service.system.SysConfigService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author csx
 * 
 */
public class CarApplyAction extends BaseAction {
	@Resource
	private CarApplyService carApplyService;
	private CarApply carApply;
	@Resource
	private ShortMessageService shortMessageService;
	@Resource
	private CarService carService;
	@Resource
	private CarDriverService carDriverService;
	@Resource
	private CarUsingService carUsingService;
	@Resource
	private SmsMobileService smsMobileService;
	@Resource
	private SysConfigService sysConfigService;

	/**
	 * 流程的定义ID
	 */
	private Long defId;

	private Long applyId;

	private String startTime;

	private String endTime;

	private String onDutyTime;

	private String offDutyTime;

	private String applyRepId;

	private String status;
	private String status2;

	private String carNo;

	public void setCarUsingService(CarUsingService carUsingService) {
		this.carUsingService = carUsingService;
	}

	public CarDriverService getCarDriverService() {
		return carDriverService;
	}

	public void setCarDriverService(CarDriverService carDriverService) {
		this.carDriverService = carDriverService;
	}

	public CarService getCarService() {
		return carService;
	}

	public void setCarService(CarService carService) {
		this.carService = carService;
	}

	public String getOnDutyTime() {
		return onDutyTime;
	}

	public void setOnDutyTime(String onDutyTime) {
		this.onDutyTime = onDutyTime;
	}

	public String getOffDutyTime() {
		return offDutyTime;
	}

	public void setOffDutyTime(String offDutyTime) {
		this.offDutyTime = offDutyTime;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public Long getDefId() {
		return defId;
	}

	public void setDefId(Long defId) {
		this.defId = defId;
	}

	public Long getApplyId() {
		return applyId;
	}

	public void setApplyId(Long applyId) {
		this.applyId = applyId;
	}

	public CarApply getCarApply() {
		return carApply;
	}

	public void setCarApply(CarApply carApply) {
		this.carApply = carApply;
	}

	public String getApplyRepId() {
		return applyRepId;
	}

	public void setApplyRepId(String applyRepId) {
		this.applyRepId = applyRepId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getStatus2() {
		return status2;
	}

	public void setStatus2(String status2) {
		this.status2 = status2;
	}

	public void setSmsMobileService(SmsMobileService smsMobileService) {
		this.smsMobileService = smsMobileService;
	}

	public String getCarNo() {
		return carNo;
	}

	public void setCarNo(String carNo) {
		this.carNo = carNo;
	}

	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		AppUser user = ContextUtil.getCurrentUser();
		SysConfig iscaradminAdminID = sysConfigService.findByKey("carAdminRoleID");
		Set<AppRole> roles = user.getRoles();
		boolean isAdmin = false;
		boolean iscarAdmin = false;
		for (AppRole role : roles) {
			if (role.getRoleId().toString().equals("-1")) {
				isAdmin = true;
				logger.info("当前用户具有系统超级管理员");
				break;
			}
		}
		for (AppRole role : roles) {
			if ((role.getRoleId().toString().equals(iscaradminAdminID
					.getDataValue()))) {
				iscarAdmin = true;
				logger.info("当前用户具有车辆管理员");
				break;
			}
		}
		if (!isAdmin&&!iscarAdmin) {
			filter.addFilter("Q_userId_L_EQ", (user.getId()).toString()); 
		}
		List<CarApply> list = carApplyService.getAll(filter);
		list = carApplyService.gettask(list);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
				"applyDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
				"startTime");
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
				"endTime");
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 显示车辆使用情况
	 */
	public String uselist() {
		AppUser currentUser = ContextUtil.getCurrentUser();
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
		int userId=-999;
		int operatorId=-999;
		SysConfig iscaradminAdminID = sysConfigService.findByKey("carAdminRoleID");
		Set<AppRole> roles = currentUser.getRoles();
		boolean iscaradminAdmin = false;
		for (AppRole role : roles) {
			if ((role.getRoleId().toString().equals(iscaradminAdminID
					.getDataValue()))) {
				iscaradminAdmin = true;
				break;
			}
		}
		if (currentUser.getIsAdmin() || iscaradminAdmin){
			operatorId = -888;
		     userId=-888;
		     createBy="admin";}
		else {
			if (getRequest().getParameter("operatorId")!= null) {
				operatorId = Integer.parseInt(getRequest().getParameter(
						"operatorId"));
			}
			if (getRequest().getParameter("userId") != null
					&& !"".equals(getRequest().getParameter("userId"))) {
				userId = Integer.parseInt(getRequest().getParameter("userId"));
			}
			if(getRequest().getParameter("createBy")!=null&& !"".equals(createBy));
			createBy =getRequest().getParameter("createBy");
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("enddate");
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
		List<CarApply> list = carApplyService.usefind(status,status2,createBy, carNo, sdt, edt,userId,operatorId ,size, start);
		Long con = carApplyService.usecount(status,status2,createBy,carNo,sdt, edt,userId , operatorId);
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
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				CarApply carApply = carApplyService.get(new Long(id));
				if (carApply.getDriverId() != null) {
					// 把司机状态变为空闲状态
					CarDriver carDriver = carDriverService.get(carApply
							.getDriverId());
					carDriver.setIsLeaving(new Short("1"));
				}
				carApplyService.remove(new Long(id));
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
		CarApply carApply = new CarApply();
		if (applyId == null) {
			if (applyRepId != null) {

				carApply = carApplyService.get(new Long(applyRepId));
			}
		} else {
			carApply = carApplyService.get(applyId);
		}

		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
				"applyDate");
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
				"startTime");
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
				"endTime");
		sb.append(serializer.exclude(new String[] { "class", "car.carApplys" })
				.serialize(carApply));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}

	public String check() {
		String applyId = getRequest().getParameter("applyId");
		String approvalStatus = getRequest().getParameter("approvalStatus");

		carApply = carApplyService.get(new Long(applyId));
		carApply.setApprovalStatus(new Short(approvalStatus));
		carApplyService.save(carApply);

		Long receiveId = carApply.getUserId();
		Car car = carService.get(carApply.getCar().getCarid());

		String content = "你申请的车牌号为" + car.getCarno() + "已经通过审批.";
		if (carApply.getApprovalStatus() == CarApply.NOTPASS_APPLY) {
			content = "你申请的车牌号为" + car.getCarno() + "没有通过审批.";
		}
		shortMessageService.save(AppUser.SYSTEM_USER, receiveId.toString(),
				content, ShortMessage.MSG_TYPE_SYS);
		setJsonString("{success:true,message:'已经成功提交审批~'}");
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		// 定义验证信息
		StringBuffer msg = new StringBuffer("{msg:'");
		if (carApply.getStartTime() != null && carApply.getEndTime() != null) {
			if (carApply.getStartTime().getTime() > carApply.getEndTime()
					.getTime()) {
				msg.append("validationError'");
				msg.append(",failure:true}");
				// setJsonString("{result:1}");
				setJsonString(msg.toString());
				return SUCCESS;
			}
		}
		carApply.setCreateBy(ContextUtil.getCurrentUser().getUsername());
		carApply.setCreateDate(new Date());
		carApply.setUpdateDate(new Date());
		carApply.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
		carApply.setCarAmount(new Short("0"));
		if (carApply.getApprovalStatus() == null) {
			carApply.setApprovalStatus(CarApply.NOTPASS_APPLY);
			carApply.setApplyDate(new Date());
		}
		// 分配车辆,分配多辆车
		if (carApply.getCarIds() != null && !"".equals(carApply.getCarIds())) {
			// 分配车辆
			int i = 0;
			for (String id : carApply.getCarIds().split(",")) {
				Car car = carService.get(Long.valueOf(id));
				carApply.getCars().add(car);
				car.setStatus(new Short("3"));// 修改车状态 已申请
				// 分配司机
				if (carApply.getDriverIds() != null
						&& StringUtils.isNotEmpty(carApply.getDriverIds())) {
					String[] driverIds = carApply.getDriverIds().split(",");
					if (carApply.getCarIds().split(",").length != driverIds.length) {
						setJsonString("{result:2}");
						return SUCCESS;
					}
					if (i < driverIds.length) {
						// car.setDriverTmpId(Long.valueOf(driverIds[i]));
						// 修改司机的状态
						CarDriver carDriver = carDriverService.get(Long
								.valueOf(driverIds[i]));
						carDriver.setIsLeaving(new Short("2"));
						carDriverService.save(carDriver);
					}
				}
				carService.save(car);
				i++;
				System.out.println("---Cars---" + carApply.getCars().size());
			}

			// 申请状态
			if (carApply.getIshavecardriver() == 2) {
				carApply.setStatus(new Short("2"));// 已处理状态
			} else if (StringUtils.isNotBlank(carApply.getDriver())) {
				carApply.setStatus(new Short("2"));
			}

		} else {// 不分配车辆并更新状态
			if (status != null && status.equals("2")) {// 这里的2表示前台传过来的表示没有资源
				// 没有资源的状态
				// carApply.setStatus(new Short("3"));
				carApply.setStatus(CarApply.NO_RESOURCES);
			} else {
				// carApply.setStatus(new Short("1"));// 未处理状态
				carApply.setStatus(CarApply.NOT_DISTRIBUTE);// 未处理状态
			}
		}
		if (carApply.getApplyId() == null) {
			carApplyService.save(carApply);
		} else {
			CarApply orgCarApply = carApplyService.get(carApply.getApplyId());
			try {
				BeanUtil.copyNotNullProperties(orgCarApply, carApply);
				carApplyService.save(orgCarApply);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}

		// 写入车辆记录表 //这里的2代表已经分配
		System.out.println("carApply.getStatus():" + carApply.getStatus());
		if (carApply.getStatus() == 2) {
			if (carApply.getIseffective() == 1) {
				int i = carApply.getCars().size() - 1;
				for (Car car : carApply.getCars()) {
					// 不是长期有效申请
					CarUsing carUsing = new CarUsing();
					carUsing.setApplyId(carApply.getApplyId());
					carUsing.setLeavingDt(carApply.getStartTime());
					carUsing.setCarId(car.getCarid());
					if (StringUtils.isNotEmpty(carApply.getDriver())) {
						carUsing.setDriver(carApply.getDriver().split(",")[i]);
						carUsing.setDriverId(Long.valueOf(carApply
								.getDriverIds().split(",")[i]));
					}
					// carUsing.setOilCardId(car.getOilCardId());
					// carUsing.setPayCardId(car.getPayCardId());
					carUsing.setCar(car);
					carUsing.setCreateDate(new Date());
					carUsing.setCreateBy(ContextUtil.getCurrentUser()
							.getUsername());
					carUsing.setUpdateDate(new Date());
					carUsing.setUpdateBy(ContextUtil.getCurrentUser()
							.getUsername());
					carUsingService.save(carUsing);
					i--;
				}
			}
			// 发消息给司机和申请人
			// 根据配置文件参数来判断，如果参数配置为 true 则发短信，否则就不调用发短信的代码
			SysConfig sysConfig = sysConfigService.findDataValueByTkCkey(
					"startMobile", "startMobile");
			if (sysConfig != null
					&& StringUtils.isNotEmpty(sysConfig.getDataValue())
					&& sysConfig.getDataValue().equals("true")) {
				moblieDriver(carApply);
			}
		}
		// carApplyService.save(carApply);
		setJsonString("{success:true,applyId:" + carApply.getApplyId() + "}");
		return SUCCESS;
	}

	/**
	 * 
	 * 审批通过后修改车辆申请状态
	 * 
	 * @param carApplyId
	 * @return
	 */
	public String update() {
		CarApply carApply = carApplyService.get(applyId);
		carApply.setApprovalStatus(new Short("3"));
		carApplyService.save(carApply);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 
	 * 获取可用使用的车
	 * 
	 * @return
	 */
	private List<Car> getuseCars() {
		Date startDate = null;
		Date endDate = null;
		try {
			if (StringUtils.isNotBlank(startTime)) {
				startDate = DateUtil2.convertString2Time(startTime);
			}
			if (StringUtils.isNotBlank(endTime)) {
				endDate = DateUtil2.convertString2Time(endTime);
			}
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("----startDate----" + startDate + "-----endDate---"
				+ endDate);
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_approvalStatus_SN_EQ", "3");// 审批通过
		filter.addFilter("Q_status_SN_EQ", "2");// 已分配车辆
		List<CarApply> carApplies = carApplyService.getAll(filter);// 获取所有审批通过并且已经分配了车辆的申请单
		List<CarApply> carAppliesList = new ArrayList<CarApply>();
		List<Car> carList = new ArrayList<Car>();
		List<Car> noUseCars = new ArrayList<Car>();
		for (CarApply carApply : carApplies) {
			long onTime = 0L;
			long offTime = 0L;
			if (StringUtils.isNotEmpty(carApply.getOnDutyTime())) {
				// 已有的长期用车
				onTime = DateUtil2.getTimeOut(carApply.getOnDutyTime());
			}
			if (StringUtils.isNotEmpty(carApply.getOffDutyTime())) {
				// 已有的长期用车
				offTime = DateUtil2.getTimeOut(carApply.getOffDutyTime());
			}
			if (StringUtils.isNotBlank(onDutyTime)
					&& StringUtils.isNotBlank(offDutyTime)) {
				System.out.println("------onDutyTime----" + onDutyTime
						+ "---offDutyTime------" + offDutyTime);
				// 长期用车
				long startTime2 = DateUtil2.getTimeOut(onDutyTime);
				long endTime2 = DateUtil2.getTimeOut(offDutyTime);
				if (carApply.getStartTime().getTime() + onTime > endDate
						.getTime() + endTime2
						|| carApply.getEndTime().getTime() + offTime < startDate
								.getTime() + startTime2) {
					// 这些车是可以在这个时间段被申请
					carList.addAll(carApply.getCars());
					carAppliesList.add(carApply);
				} else {
					noUseCars.addAll(carApply.getCars());
				}
			} else {
				// 短期用车
				if (carApply.getStartTime().getTime() + onTime > endDate
						.getTime()
						|| carApply.getEndTime().getTime() + offTime < startDate
								.getTime()) {
					// 这些车是可以在这个时间段被申请
					carList.addAll(carApply.getCars());
					carAppliesList.add(carApply);
				} else {
					noUseCars.addAll(carApply.getCars());
				}
			}
		}

		System.out.println("-----carList1111111-----" + carList.size());
		for (int i = carList.size() - 1; i >= 0; i--) {
			if (noUseCars.contains(carList.get(i))) {
				carList.remove(i);
			}
		}
		System.out.println("-----carList2222-----" + carList.size());
		if (ParamMap.carDriverMap != null) {
			ParamMap.carDriverMap.clear();
		}
		List<CarDriver> carDrivers = new ArrayList<CarDriver>();
		for (CarApply carApply : carAppliesList) {
			if (StringUtils.isNotEmpty(carApply.getDriverIds())) {
				String[] driverIds = carApply.getDriverIds().split(",");
				String[] cars = carApply.getCarIds().split(",");
				int num = cars.length;
				for (int i = 0; i < num; i++) {
					carDrivers.add(carDriverService.get(Long
							.valueOf(driverIds[i])));
				}
			}
		}
		ParamMap.carDriverMap.put("driver", carDrivers);
		System.out.println("----carDrivers22222---" + carDrivers.size());
		return carList;
	}

	/**
	 * 
	 * 获取某个时段空闲的车辆
	 * 
	 * @return
	 */
	public String getUseless() {
		QueryFilter filter1 = new QueryFilter(getRequest());
		filter1.addFilter("Q_status_SN_EQ", "1");// 可用的车辆
		List<Car> cars = carService.getAll(filter1);
		System.out.println("-----cars-----" + cars.size());
		List<Car> carList = getuseCars();
		cars.addAll(carList);
		System.out.println("-----allCars-----" + cars.size());
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter1.getPagingBean().getTotalItems()
						+ carList.size()).append(",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"buyinsuretime", "audittime", "buydate", "createDate",
				"updateDate" });
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(cars));
		buff.append("}");
		jsonString = buff.toString();
		// System.out.println("----getUselessCar-----" + buff.toString());
		return SUCCESS;
	}

	/**
	 * 
	 * 获取可以分配的车辆
	 * 
	 * @return
	 */
	public String getVilabe() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		Date startDate = null;
		try {
			startDate = sdf.parse(getRequest().getParameter("startTime"));
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		Date endDate = null;
		try {
			endDate = sdf.parse(getRequest().getParameter("endTime"));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("----startDate----" + startDate + "-----endDate---"
				+ endDate);
		int size = Integer.parseInt(getRequest().getParameter("limit"));
		int start = Integer.parseInt(getRequest().getParameter("start"));
		// QueryFilter filter = new QueryFilter(getRequest());
		List<Car> carApplies = carService.getCarVilabe(startDate, endDate,
				size, start);
		Long con = carService.count(startDate, endDate);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(con)
				/* .append(carApplies.size()) */
				/* .append(filter.getPagingBean().getTotalItems()) */.append(
						",result:");
		;
		JSONSerializer serializer = new JSONSerializer();
		buff.append(serializer.exclude(new String[] { "class" }).serialize(
				carApplies));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 
	 * 获取可以分配的司机
	 * 
	 * @return
	 */
	public String getDriverVilabe() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		Date startDate = null;
		try {
			startDate = sdf.parse(getRequest().getParameter("startTime"));
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		Date endDate = null;
		try {
			endDate = sdf.parse(getRequest().getParameter("endTime"));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("----startDate----" + startDate + "-----endDate---"
				+ endDate);
		int size = Integer.parseInt(getRequest().getParameter("limit"));
		int start = Integer.parseInt(getRequest().getParameter("start"));
		// QueryFilter filter = new QueryFilter(getRequest());
		List<CarDriver> carApplies = carApplyService.getCarDriverVilabe(
				startDate, endDate, size, start);
		Long con = carApplyService.count(startDate, endDate);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(con)
				/* .append(carApplies.size()) */
				/* .append(filter.getPagingBean().getTotalItems()) */.append(
						",result:");
		;
		JSONSerializer serializer = new JSONSerializer();
		buff.append(serializer.exclude(new String[] { "class" }).serialize(
				carApplies));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 
	 * 获取空闲的司机
	 * 
	 * @return
	 */
	public String getUseDriver() {
		// List<CarDriver> carDrivers = new ArrayList<CarDriver>();
		// if (ParamMap.carDriverMap != null
		// && ParamMap.carDriverMap.get("driver") != null) {
		// carDrivers = ParamMap.carDriverMap.get("driver");
		// ParamMap.carDriverMap.clear();
		// }
		// System.out.println("----carDrivers---" + carDrivers.size());
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_isLeaving_SN_EQ", "1");
		List<CarDriver> list = carDriverService.getAll(filter);
		// list.addAll(carDrivers);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "licenseSDt");
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "licenseEDt");
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");
		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 
	 * 更新申请车辆的状态
	 * 
	 * @return
	 */
	public String updateStatus() {
		CarApply carApply = carApplyService.get(new Long(applyRepId));
		carApply.setApprovalStatus(new Short("1"));
		carApplyService.save(carApply);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 
	 * 给司机和申请人员发短信
	 * 
	 */
	public void moblieDriver(CarApply carApply) {
		if (StringUtils.isNotEmpty(carApply.getDriverIds())) {
			int i = 0;
			for (String id : carApply.getDriverIds().split(",")) {
				// 发送消息给司机
				CarDriver carDriver = carDriverService.get(Long.valueOf(id));
				SmsMobile smsMobile = new SmsMobile();
				smsMobile.setPhoneNumber(carDriver.getCellPhone());
				String content = "你被分配的出车时间是:" + carApply.getStartTime() + "到"
						+ carApply.getEndTime() + ", 车牌号是:"
						+ carApply.getCarNo().split(",")[i];
				smsMobile.setSmsContent(content);
				smsMobile.setSendTime(new Date());
				smsMobile.setRecipients(carDriver.getName());
				smsMobile.setUserId(AppUser.SYSTEM_USER);
				smsMobile.setUserName("系统");
				smsMobile.setStatus(SmsMobile.STATUS_NOT_SENDED);
				smsMobileService.save(smsMobile);
				logger.debug("====发送短信给===" + carDriver.getName());
				// smsMobileService.sendOneSms(smsMobile);
				i++;
			}
		}
		if (carApply.getUserId() != null) {
			// 发送消息给申请人
			String content = "你的车辆申请单已审核完成,请查看车辆分配情况";
			smsMobileService.saveSms(carApply.getUserId().toString(), content);
		}
	}

	/**
	 * 
	 * 收车的时候,根据车辆带出长期用车的申请单
	 * 
	 * @return
	 */
	public String getListCar() {
		String carno = getRequest().getParameter("carNo");
		System.out.println("----carno-----" + carno);
		List<Car> cars = carService.getListCars(carno);
		if (cars != null && cars.size() > 0) {

			QueryFilter filter = new QueryFilter(getRequest());
			filter.addFilter("Q_approvalStatus_SN_EQ", "1");
			filter.addFilter("Q_iseffective_SN_EQ", "2");
			filter.addFilter("Q_status_SN_EQ", "2");
			List<CarApply> list = carApplyService.getAll(filter);
			System.out.println("---------list------" + list.size());
			List<CarApply> carApplies = new ArrayList<CarApply>();
			for (CarApply carApply : list) {
				List<String> carIds = java.util.Arrays.asList(carApply
						.getCarIds().split(","));
				for (Car car : cars) {
					if (carIds.contains(car.getCarid().toString())) {
						carApplies.add(carApply);
						break;
					}
				}

			}
			System.out.println("----carApplies----" + carApplies.size());
			StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
					.append(carApplies.size()).append(",result:");
			// 下面的方式可以指定日期时间的返回类型
			JSONSerializer serializer = new JSONSerializer();
			serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
					"applyDate");
			serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
					"startTime");
			serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
					"endTime");
			buff.append(serializer.exclude(new String[] { "class" }).serialize(
					carApplies));
			buff.append("}");
			jsonString = buff.toString();
		} else {
			// 没有这辆车
			setJsonString("{result:1}");
		}
		return SUCCESS;
	}

	/**
	 * 添加车辆申请流程（carflow）及保存操作
	 */
	public String saveCarFlow() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String start = getRequest().getParameter("startTime");
		String end = getRequest().getParameter("endTime");
		if (start != null && end != null) {
			start += ":00";
			end += ":00";
			try {
				carApply.setStartTime(sdf.parse(start));
				carApply.setEndTime(sdf.parse(end));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		carApply.setCreateBy(ContextUtil.getCurrentUser().getUsername());
		carApply.setCreateDate(new Date());
		carApply.setUpdateDate(new Date());
		carApply.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
		carApply.setStatus(new Short("1"));
		// carApply.setApprovalStatus(new Short("3"));
		// carApply.setCarAmount(new Short("0"));
		/*
		 * if (carApply.getApprovalStatus() == null) {
		 * carApply.setApprovalStatus(CarApplyMy.NOTPASS_APPLY);
		 * carApply.setApplyDate(new Date()); }
		 */
		// 分配车辆,分配多辆车
		/*
		 * if (carApply.getCarIds() != null && !"".equals(carApply.getCarIds()
		 * )) { // 分配车辆 int i = 0; for (String id :
		 * carApply.getCarIds().split(",")) { Car car =
		 * carService.get(Long.valueOf(id)); carApply.getCars().add(car);
		 * car.setStatus(new Short("3"));// 修改车状态 已申请 // 分配司机 if
		 * (carApply.getDriverIds() != null &&
		 * StringUtils.isNotEmpty(carApply.getDriverIds())) { String[] driverIds
		 * = carApply.getDriverIds().split(","); if
		 * (carApply.getCarIds().split(",").length != driverIds.length) {
		 * setJsonString("{result:2}"); return SUCCESS; } if (i <
		 * driverIds.length) { //
		 * car.setDriverTmpId(Long.valueOf(driverIds[i])); // 修改司机的状态 CarDriver
		 * carDriver = carDriverService.get(Long .valueOf(driverIds[i]));
		 * carDriver.setIsLeaving(new Short("2"));
		 * carDriverService.save(carDriver); } } carService.save(car); i++;
		 * System.out.println("---Cars---" + carApplyMy.getCars().size()); }
		 * 
		 * // 申请状态 if (carApply.getIshavecardriver() == 2) {
		 * carApply.setStatus(new Short("2"));// 已处理状态 } else if
		 * (StringUtils.isNotBlank(carApply.getDriver())) {
		 * carApply.setStatus(new Short("2")); }
		 * 
		 * } else {//不分配车辆并更新状态 if (status != null && status.equals("2"))
		 * {//这里的2表示前台传过来的表示没有资源 // 没有资源的状态 //carApply.setStatus(new
		 * Short("3")); carApply.setStatus(CarApply.NO_RESOURCES); } else {
		 * //carApply.setStatus(new Short("1"));// 未处理状态
		 * carApply.setStatus(CarApply.NOT_DISTRIBUTE);// 未处理状态 } }
		 */
		if (carApply.getApplyId() == null) {
			carApplyService.save(carApply);
		} else {
			CarApply orgCarApply = carApplyService.get(carApply.getApplyId());
			try {
				BeanUtil.copyNotNullProperties(orgCarApply, carApply);
				carApplyService.save(orgCarApply);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}

		// 写入车辆记录表 //这里的2代表已经分配
		/*
		 * System.out.println("carApply.getStatus():"+carApplyMy.getStatus());
		 * if (carApplyMy.getStatus() == 2) { if (carApplyMy.getIseffective() ==
		 * 1) { int i = carApplyMy.getCars().size() - 1; for (Car car :
		 * carApplyMy.getCars()) { // 不是长期有效申请 CarUsing carUsing = new
		 * CarUsing(); carUsing.setApplyId(carApplyMy.getApplyId());
		 * carUsing.setLeavingDt(carApplyMy.getStartTime());
		 * carUsing.setCarId(car.getCarid()); if
		 * (StringUtils.isNotEmpty(carApplyMy.getDriver())) {
		 * carUsing.setDriver(carApplyMy.getDriver().split(",")[i]);
		 * carUsing.setDriverId(Long.valueOf(carApplyMy
		 * .getDriverIds().split(",")[i])); }
		 * //carUsing.setOilCardId(car.getOilCardId());
		 * //carUsing.setPayCardId(car.getPayCardId()); carUsing.setCar(car);
		 * carUsing.setCreateDate(new Date());
		 * carUsing.setCreateBy(ContextUtil.getCurrentUser() .getUsername());
		 * carUsing.setUpdateDate(new Date());
		 * carUsing.setUpdateBy(ContextUtil.getCurrentUser() .getUsername());
		 * carUsingService.save(carUsing); i--; } }
		 */
		// 发消息给司机和申请人
		// 根据配置文件参数来判断，如果参数配置为 true 则发短信，否则就不调用发短信的代码
		/*
		 * SysConfig sysConfig = sysConfigService.findDataValueByTkCkey(
		 * "startMobile", "startMobile"); if (sysConfig != null &&
		 * StringUtils.isNotEmpty(sysConfig.getDataValue()) &&
		 * sysConfig.getDataValue().equals("true")) { moblieDriver(carApplyMy);
		 * } }
		 */
		// carApplyService.save(carApply);
		setJsonString("{success:true,applyId:" + carApply.getApplyId() + "}");
		return SUCCESS;
	}

	/**
	 * 
	 * 获取可用使用的车
	 * 
	 * @return
	 */
	public String getCanApplyCars() {
		QueryFilter filter1 = new QueryFilter(getRequest());
		Date startDate = null;
		Date endDate = null;
		try {
			if (StringUtils.isNotBlank(startTime)) {
				startDate = DateUtil2.convertString2Time(startTime);
			}
			if (StringUtils.isNotBlank(endTime)) {
				endDate = DateUtil2.convertString2Time(endTime);
			}
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("----startDate----" + startDate + "-----endDate---"
				+ endDate);
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_approvalStatus_SN_EQ", "3");// 审批通过
		// filter.addFilter("Q_status_SN_EQ", "2");// 已分配车辆
		List<CarApply> carApplies = carApplyService.getAll(filter);// 获取所有审批通过并且已经分配了车辆的申请单
		List<CarApply> carAppliesList = new ArrayList<CarApply>();
		List<Car> getCars = carService.getAll(filter1);// 获取所有的车
		List<Car> carList = new ArrayList<Car>();
		List<Car> noUseCars = new ArrayList<Car>();
		for (CarApply carApply : carApplies) {
			long onTime = 0L;
			long offTime = 0L;
			if (StringUtils.isNotEmpty(carApply.getOnDutyTime())) {
				// 已有的长期用车
				onTime = DateUtil2.getTimeOut(carApply.getOnDutyTime());
			}
			if (StringUtils.isNotEmpty(carApply.getOffDutyTime())) {
				// 已有的长期用车
				offTime = DateUtil2.getTimeOut(carApply.getOffDutyTime());
			}
			if (StringUtils.isNotBlank(onDutyTime)
					&& StringUtils.isNotBlank(offDutyTime)) {
				System.out.println("------onDutyTime----" + onDutyTime
						+ "---offDutyTime------" + offDutyTime);
				// 长期用车
				long startTime2 = DateUtil2.getTimeOut(onDutyTime);
				long endTime2 = DateUtil2.getTimeOut(offDutyTime);
				if (carApply.getStartTime().getTime() + onTime > endDate
						.getTime() + endTime2
						|| carApply.getEndTime().getTime() + offTime < startDate
								.getTime() + startTime2) {
					// 这些车是可以在这个时间段被申请
					carList.addAll(carApply.getCars());
					carAppliesList.add(carApply);

				} else {
					noUseCars.addAll(carApply.getCars());
				}
			} else {
				// 短期用车
				if (!(carApply.getStartTime().getTime() + onTime > endDate
						.getTime() || carApply.getEndTime().getTime() + offTime < startDate
						.getTime())) {// 这些车是可以在这个时间段不能被申请

					for (Car car : getCars) {
						if (car.getCarno() != carApply.getCarNo())
							carList.add(car);
						// carAppliesList.add(carApply);
					}
				} /*
				 * else { noUseCars.addAll(carApply.getCars()); }
				 */
			}
		}

		/*
		 * System.out.println("-----carList1111111-----" + carList.size()); for
		 * (int i = carList.size() - 1; i >= 0; i--) { if
		 * (noUseCars.contains(carList.get(i))) { carList.remove(i); } }
		 */
		System.out.println("-----carList2222-----" + carList.size());
		if (ParamMap.carDriverMap != null) {
			ParamMap.carDriverMap.clear();
		}
		List<CarDriver> carDrivers = new ArrayList<CarDriver>();
		for (CarApply carApply : carAppliesList) {
			if (StringUtils.isNotEmpty(carApply.getDriverIds())) {
				String[] driverIds = carApply.getDriverIds().split(",");
				String[] cars = carApply.getCarIds().split(",");
				int num = cars.length;
				for (int i = 0; i < num; i++) {
					carDrivers.add(carDriverService.get(Long
							.valueOf(driverIds[i])));
				}
			}
		}
		ParamMap.carDriverMap.put("driver", carDrivers);
		System.out.println("----carDrivers22222---" + carDrivers.size());

		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter1.getPagingBean().getTotalItems()
						+ carList.size()).append(",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"buyinsuretime", "audittime", "buydate", "createDate",
				"updateDate" });
		buff.append(serializer.exclude(new String[] { "class" }).serialize(
				carList));
		buff.append("}");
		jsonString = buff.toString();
		// System.out.println("----getUselessCar-----" + buff.toString());
		return SUCCESS;
	}
}
