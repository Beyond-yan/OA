package com.gdssoft.oa.action.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.text.ParseException;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.job.DateUtil2;
import com.gdssoft.oa.model.admin.Car;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.admin.CarCardHistory;
import com.gdssoft.oa.model.admin.CarDriver;
import com.gdssoft.oa.model.admin.CarPassFeeCard;
import com.gdssoft.oa.model.admin.CarUsing;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.admin.CarApplyService;
import com.gdssoft.oa.service.admin.CarCardHistoryService;
import com.gdssoft.oa.service.admin.CarDriverService;
import com.gdssoft.oa.service.admin.CarPassFeeCardService;
import com.gdssoft.oa.service.admin.CarService;
import com.gdssoft.oa.service.admin.CarUsingService;

import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class CarUsingAction extends BaseAction {
	@Resource
	private CarUsingService carUsingService;
	private CarUsing carUsing;
	@Resource
	private CarPassFeeCardService carPassFeeCardService;
	@Resource
	private CarCardHistoryService carCardHistoryService;
	@Resource
	private CarApplyService carApplyService;
	@Resource
	private CarService carService;
	@Resource
	private CarDriverService carDriverService;
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public CarUsing getCarUsing() {
		return carUsing;
	}

	public void setCarUsing(CarUsing carUsing) {
		this.carUsing = carUsing;
	}

	public void setCarPassFeeCardService(
			CarPassFeeCardService carPassFeeCardService) {
		this.carPassFeeCardService = carPassFeeCardService;
	}

	public void setCarCardHistoryService(
			CarCardHistoryService carCardHistoryService) {
		this.carCardHistoryService = carCardHistoryService;
	}

	public void setCarApplyService(CarApplyService carApplyService) {
		this.carApplyService = carApplyService;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		List<CarUsing> list = carUsingService.getAll(filter);

		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = JsonUtil.getJSONSerializer("leavingDt",
				"comingDt");
		buff.append(serializer.exclude(new String[] { "class" })
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
				carUsingService.remove(new Long(id));
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
		CarUsing carUsing = carUsingService.get(id);

		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = JsonUtil.getJSONSerializer(new String[] {
				"leavingDt", "comingDt" });
		sb.append(serializer.exclude(new String[] { "class" }).serialize(
				carUsing));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		CarApply carApply = carApplyService.get(carUsing.getApplyId());
		// 计算过路费
		double passFee = carUsing.getPassFee() == null ? 0.0 : Double
				.valueOf(carUsing.getPassFee());
		//Long parCardId = carUsing.getPayCardId();
		/*if (parCardId == null) {
			if (carUsing.getCarId() != null) {
				parCardId = carService.get(carUsing.getCarId()).getPayCardId();

			} else {
				setJsonString("{success:false}");
				return SUCCESS;
			}
		}*/
		//CarPassFeeCard carPassFeeCard = carPassFeeCardService.get(parCardId);

		//double remains = Double.valueOf(carPassFeeCard.getRemains());
		// 剩下的金额
		//double price = (remains - passFee >= 0) ? remains - passFee : 0.0;
	//	carPassFeeCard.setRemains(String.valueOf(price));
	//	carPassFeeCardService.save(carPassFeeCard);

		double otherFee = Double.valueOf(carUsing.getOtherFee() == null ? "0"
				: carUsing.getOtherFee());
		double feeAmount = passFee
				+ otherFee
				+ Double.valueOf(carUsing.getParkFee() == null ? "0" : carUsing
						.getParkFee());

		carUsing.setFeeAmount(String.valueOf(feeAmount));
		AppUser currentUser = ContextUtil.getCurrentUser();
		carUsing.setCreateBy(currentUser.getUsername());
		carUsing.setCreateDate(new Date());
		carUsing.setUpdateDate(new Date());
		carUsing.setUpdateBy(currentUser.getUsername());

		if (carUsing.getId() == null) {
			//CarPassFeeCard carPassFeeCard =new CarPassFeeCard();
		
		//	carUsing.setCarPassFeeCard(carPassFeeCard);
			carUsingService.save(carUsing);
		} else {
			CarUsing orgCarUsing = carUsingService.get(carUsing.getId());
			try {
				BeanUtil.copyNotNullProperties(orgCarUsing, carUsing);
				carUsingService.save(orgCarUsing);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}

		// 扣款历史
		CarCardHistory carCardHistory = new CarCardHistory();
		carCardHistory.setCardId(carUsing.getCarId());
		carCardHistory.setCardType(new Short("2"));// 粤通卡
		//carCardHistory.setAmount(String.valueOf(remains - price));
		carCardHistory.setUseType(new Short("2"));// 扣款
		carCardHistory.setUseDate(new Date());
		carCardHistoryService.save(carCardHistory);

		// int carAmount = carApply.getCarAmount().intValue() + 1;
		int carNum = carApply.getCarIds().split(",").length;
		int carAmount = carUsingService.getCarUsingCount(carUsing.getApplyId());
		// 申请单改成已收车的状态
		if (carApply.getIseffective() == 1) {
			carApply.setCarAmount((short) (carAmount));
			// 申请单多辆车都被收回
			if (carAmount >= carNum) {
				carApply.setStatus(new Short("3"));// 已收车状态
			}
			carApplyService.save(carApply);
		} else {
			// 长期用车
			String endTime = DateUtil2
					.DateToString(carApply.getEndTime(), null);
			String endDate = endTime + " " + carApply.getOffDutyTime() + ":00";
			Date dt = null;
			try {
				dt = DateUtil2.convertString2Time(endDate);
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			// if (carUsing.getComingDt().getTime() >= dt.getTime()) {
			//				
			// }
			if (carAmount >= carNum) {
				carApply.setStatus(new Short("3"));// 已收车状态
				carApplyService.save(carApply);
			}
		}
		// 更新车辆的状态和司机的状态
		boolean notUse = true;
		List<CarApply> carApplies = carApplyService.getIsUserCar(carUsing
				.getCarId(), carUsing.getApplyId());
		if (carApplies.size() > 0) {
			Long driverId = null;
			// 根据车，申请单 判断这辆车是否已经都被收回
			for (CarApply carApply2 : carApplies) {
				CarUsing carUs = carUsingService.checkCarStatus(carUsing
						.getCarId(), carApply2.getApplyId());
				if (carUs == null) {
					System.out.println("-----carId----" + carUsing.getCarId());
					System.out.println("-----carApplyId----"
							+ carApply2.getApplyId());
					driverId = carUsing.getDriverId();
					// 说明这辆车还没有被收回,车辆处于被申请状态
					notUse = false;
					break;
				}
			}
			if (driverId != null) {
				// 司机状态修改
				CarDriver carDriver = carDriverService.get(driverId);
				carDriver.setIsLeaving(new Short("1"));// 修改司机的状态
				carDriverService.save(carDriver);
			}
		}
		if (notUse) {
			Car car = carService.get(carUsing.getCarId());
			System.out.println("------car-----" + car.getCarno());
			car.setStatus(new Short("1"));// 更新车辆状态
			carService.save(car);
			if (StringUtils.isNotEmpty(carApply.getDriverIds())) {
				Long driverId = null;
				// 修改司机的状态
				String[] carDrivers = carApply.getDriverIds().split(",");
				String[] carIds = carApply.getCarIds().split(",");
				for (int i = 0; i < carIds.length; i++) {
					if (carIds[i].equals(carUsing.getCarId().toString())) {
						driverId = Long.valueOf(carDrivers[i]);
						System.out.println("-----driverId-----" + driverId);
						CarDriver carDriver = carDriverService.get(driverId);
						carDriver.setIsLeaving(new Short("1"));// 修改司机的状态
						carDriverService.save(carDriver);
						break;
					}
				}
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}
}
