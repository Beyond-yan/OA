package com.gdssoft.oa.action.admin;

import java.lang.reflect.Array;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.tools.ant.types.resources.comparators.Size;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.Boardroo;
import com.gdssoft.oa.model.admin.CarCostRecord;
import com.gdssoft.oa.model.admin.CarCostRecordDetail;
import com.gdssoft.oa.model.admin.ConfRoomEquip;
import com.gdssoft.oa.model.law.Laws;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.admin.CarCostRecordDetailService;
import com.gdssoft.oa.service.admin.CarCostRecordService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class CarCostRecordAction extends BaseAction {

	@Resource
	private CarCostRecordService carCostRecordService;

	@Resource
	private CarCostRecordDetailService carCostRecordDetailService;

	// private CarCostRecordDetail carCostRecordDetail;

	private Map<String, Map> map2;
	private CarCostRecord carCostRecord;

	CarCostRecordDetail[] costDetailArray = null;

	/*
	 * public CarCostRecordDetail getCarCostRecordDetail() { return
	 * carCostRecordDetail; }
	 * 
	 * public void setCarCostRecordDetail(CarCostRecordDetail
	 * carCostRecordDetail) { this.carCostRecordDetail = carCostRecordDetail; }
	 */

	public Map<String, Map> getMap2() {
		return map2;
	}

	public void setMap2(Map<String, Map> map2) {
		this.map2 = map2;
	}

	public CarCostRecordDetailService getCarCostRecordDetailService() {
		return carCostRecordDetailService;
	}

	public void setCarCostRecordDetailService(
			CarCostRecordDetailService carCostRecordDetailService) {
		this.carCostRecordDetailService = carCostRecordDetailService;
	}

	public CarCostRecordService getCarCostRecordService() {
		return carCostRecordService;
	}

	public void setCarCostRecordService(
			CarCostRecordService carCostRecordService) {
		this.carCostRecordService = carCostRecordService;
	}

	public CarCostRecord getCarCostRecord() {
		return carCostRecord;
	}

	public void setCarCostRecord(CarCostRecord carCostRecord) {
		this.carCostRecord = carCostRecord;
	}

	/**
	 * 按车辆和类别查询
	 */

	public String listByCarAndType() {
		Date startTime = null;
		Date endTime = null;
		int s = 0;
		int l = 10;
		List<CarCostRecord> list = null;

		if (getRequest().getParameter("start") != null
				&& !"".equals(getRequest().getParameter("start"))) {
			s = Integer.valueOf(getRequest().getParameter("start"));
		}
		if (getRequest().getParameter("limit") != null
				&& !"".equals(getRequest().getParameter("limit"))) {
			l = Integer.valueOf(getRequest().getParameter("limit"));
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		if (startDate != null && !"".equals(startDate)) {
			try {
				startTime = sdf.parse(startDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}
		if (endDate != null && !"".equals(endDate)) {
			try {
				endTime = sdf.parse(endDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}

		list = carCostRecordService
				.selectByCarAndType(startTime, endTime, s, l);
		Long count = carCostRecordService.countByCarAndType(startTime, endTime);
		Float totalAmtSum = carCostRecordService.totalSumCarAndType(startTime,
				endTime);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(count).append(",totalAmtSum:").append(totalAmtSum)
				.append(",result:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;

	}

	/**
	 * 按车辆和时间查询
	 */

	public String listByCarAndTime() {
		Date startTime = null;
		Date endTime = null;
		int s = 0;
		int l = 10;
		List<CarCostRecord> list = null;

		if (getRequest().getParameter("start") != null
				&& !"".equals(getRequest().getParameter("start"))) {
			s = Integer.valueOf(getRequest().getParameter("start"));
		}
		if (getRequest().getParameter("limit") != null
				&& !"".equals(getRequest().getParameter("limit"))) {
			l = Integer.valueOf(getRequest().getParameter("limit"));
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		if (startDate != null && !"".equals(startDate)) {
			try {
				startTime = sdf.parse(startDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}
		if (endDate != null && !"".equals(endDate)) {
			try {
				endTime = sdf.parse(endDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}

		list = carCostRecordService
				.selectByCarAndTime(startTime, endTime, s, l);
		Long count = carCostRecordService.count(startTime, endTime);
		Float totalAmtSum = carCostRecordService.totalSumCarAndTime(startTime,
				endTime);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(count).append(",totalAmtSum:").append(totalAmtSum)
				.append(",result:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;

	}

	/**
	 * 按时间分类查询
	 */

	public String listByCostDate() {
		Date startTime = null;
		Date endTime = null;
		int s = 0;
		int l = 10;
		if (getRequest().getParameter("start") != null
				&& !"".equals(getRequest().getParameter("start"))) {
			s = Integer.valueOf(getRequest().getParameter("start"));
		}
		if (getRequest().getParameter("limit") != null
				&& !"".equals(getRequest().getParameter("limit"))) {
			l = Integer.valueOf(getRequest().getParameter("limit"));
		}
		List<CarCostRecord> list = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		if (startDate != null && !"".equals(startDate)) {
			try {
				startTime = sdf.parse(startDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}
		if (endDate != null && !"".equals(endDate)) {
			try {
				endTime = sdf.parse(endDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}
		String selectBy = getRequest().getParameter("select");
		list = carCostRecordService.selectByCostDate(startTime, endTime, s, l,
				selectBy);
		Long count = carCostRecordService.countByCostDate(startTime, endTime,
				selectBy);
		Float totalAmtSum = carCostRecordService.totalSumCostDate(startTime,
				endTime, selectBy);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(count).append(",totalAmtSum:").append(totalAmtSum)
				.append(",result:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;

	}

	/**
	 * 按费用类别查询
	 */
	public String listByTypeName() {
		Date startTime = null;
		Date endTime = null;
		int s = 0;
		int l = 10;
		if (getRequest().getParameter("start") != null
				&& !"".equals(getRequest().getParameter("start"))) {
			s = Integer.valueOf(getRequest().getParameter("start"));
		}
		if (getRequest().getParameter("limit") != null
				&& !"".equals(getRequest().getParameter("limit"))) {
			l = Integer.valueOf(getRequest().getParameter("limit"));
		}
		List<CarCostRecord> list = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		if (startDate != null && !"".equals(startDate)) {
			try {
				startTime = sdf.parse(startDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}
		if (endDate != null && !"".equals(endDate)) {
			try {
				endTime = sdf.parse(endDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}

		list = carCostRecordService.selectByCostType(startTime, endTime, s, l);
		Long count = carCostRecordService.countByTypeName(startTime, endTime);
		Float totalAmtSum = carCostRecordService.totalAmtSumTypeName(startTime,
				endTime);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(count).append(",totalAmtSum:").append(totalAmtSum)
				.append(",result:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;

	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		filter.addSorted("costDate", "desc");
		filter.addSorted("costType", "desc");
		List<CarCostRecord> list = carCostRecordService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"createtime", "updatetime" });
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		AppUser user = ContextUtil.getCurrentUser();
		carCostRecord.setCreateUser(user.getFullname());
		Date date1 = new Date();
		carCostRecord.setCreateTime(date1);
		CarCostRecord carCostRecord1 = null;
		Long recordId;
		if (carCostRecord.getId() == null) {
			carCostRecord1 = carCostRecordService.save(carCostRecord);
		} else {

			CarCostRecord orgCarCostRecord = carCostRecordService
					.get(carCostRecord.getId());
			try {
				carCostRecord.setUpdateTime(date1);
				carCostRecord.setUpdateUser(user.getFullname());
				BeanUtil.copyNotNullProperties(orgCarCostRecord, carCostRecord);
				carCostRecordService.save(orgCarCostRecord);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 * 
	 * public String save() { AppUser currentUser =
	 * ContextUtil.getCurrentUser(); Date now = new Date();
	 * if(carCostRecord.getId()==null){ carCostRecord.setCreateTime(now);
	 * carCostRecord.setUpdateTime(now);
	 * carCostRecord.setCreateUser(currentUser.getUsername());
	 * carCostRecord.setUpdateUser(currentUser.getUsername());
	 * carCostRecordService.save(carCostRecord); }else{ CarCostRecord
	 * orgCarCostRecord=carCostRecordService.get(carCostRecord.getId()); try{
	 * BeanUtil.copyNotNullProperties(orgCarCostRecord,carCostRecord);
	 * carCostRecord.setUpdateTime(now);
	 * carCostRecord.setUpdateUser(currentUser.getUsername());
	 * carCostRecordService.save(orgCarCostRecord); }catch(Exception ex){
	 * 
	 * logger.error(ex.getMessage()); } }
	 * 
	 * setJsonString("{success:true,costRecordId:" + carCostRecord.getId() +
	 * "}"); return SUCCESS; }
	 */

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				carCostRecordService.remove(new Long(id));
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
		String recordId = getRequest().getParameter("id");
		carCostRecord = carCostRecordService.get(new Long(recordId));
		/*
		 * Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		 * //将数据转成JSON格式 StringBuffer sb = new
		 * StringBuffer("{success:true,data:");
		 * sb.append(gson.toJson(carCostRecord)); sb.append("}");
		 * setJsonString(sb.toString()); return SUCCESS;
		 */
		// Gson gson=new Gson();
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"createtime", "updatetime" });
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(json.exclude(new String[] { "class" }).serialize(
				carCostRecord));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 费用统计
	 */

	public String costStatistics() {

		Date startTime = null;
		Date endTime = null;
		List<CarCostRecord> list = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		String selectBy = getRequest().getParameter("selectBy");
		String carIds = getRequest().getParameter("carIds");
		if (startDate != null && !"".equals(startDate)) {
			try {
				startTime = sdf.parse(startDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}
		if (endDate != null && !"".equals(endDate)) {
			try {
				endTime = sdf.parse(endDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}

		list = carCostRecordService.costStatistics(startTime, endTime,
				selectBy, carIds);
		StringBuffer buff = new StringBuffer("{success:true")
				.append(",result:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();
		return SUCCESS;
	}
}
