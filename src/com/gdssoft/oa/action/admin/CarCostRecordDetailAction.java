package com.gdssoft.oa.action.admin;

import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.CarCostRecord;
import com.gdssoft.oa.model.admin.CarCostRecordDetail;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.admin.CarCostRecordDetailService;
import com.gdssoft.oa.service.admin.CarCostRecordService;
import com.google.gson.Gson;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;


public class CarCostRecordDetailAction extends BaseAction {
	
	@Resource
	private CarCostRecordDetailService carCostRecordDetailService;
	
	@Resource
	private CarCostRecordService carCostRecordService;
	
	private CarCostRecordDetail carCostRecordDetail;

	CarCostRecordDetail[] costDetailArray=null;
	
	
	public CarCostRecordService getCarCostRecordService() {
		return carCostRecordService;
	}

	public void setCarCostRecordService(CarCostRecordService carCostRecordService) {
		this.carCostRecordService = carCostRecordService;
	}

	public CarCostRecordDetailService getCarCostRecordDetailService() {
		return carCostRecordDetailService;
	}

	public void setCarCostRecordDetailService(
			CarCostRecordDetailService carCostRecordDetailService) {
		this.carCostRecordDetailService = carCostRecordDetailService;
	}

	public CarCostRecordDetail getCarCostRecordDetail() {
		return carCostRecordDetail;
	}

	public void setCarCostRecordDetail(CarCostRecordDetail carCostRecordDetail) {
		this.carCostRecordDetail = carCostRecordDetail;
	}
	
	
	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		String recordId = getRequest().getParameter("recordId");
		if (recordId != null && !"".equals(recordId)) {
			filter.addFilter("Q_carCostRecord.id_L_EQ", recordId);
		}
		List<CarCostRecordDetail> list = carCostRecordDetailService.getAll(filter);
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
		boolean res = true;
		AppUser currentUser = ContextUtil.getCurrentUser();
		Date now = new Date();
		String  carCostRecordId=getRequest().getParameter("carCostRecordId");
		String  strJson=getRequest().getParameter("strJson");
		if(StringUtils.isNotEmpty(strJson)){
			Gson gson=new Gson();
			costDetailArray=(CarCostRecordDetail[])gson.fromJson(strJson, CarCostRecordDetail[].class);
		    if(costDetailArray!=null){
		    	for(CarCostRecordDetail costRecordDetail:costDetailArray){
		    		if(!"".equals(carCostRecordId)&&carCostRecordId!=null){
						//costRecordDetail.getCarCostRecord().setId(Long.valueOf(carCostRecordId));
						costRecordDetail.setCarCostRecord(carCostRecordService.get(Long.valueOf(carCostRecordId)));
					}
		    		if(costRecordDetail.getId()==null){
						costRecordDetail.setCreateTime(now);
						costRecordDetail.setUpdateTime(now);
						costRecordDetail.setCreateUser(currentUser.getUsername());
						costRecordDetail.setUpdateUser(currentUser.getUsername());
						carCostRecordDetailService.save(costRecordDetail);
					}else{
						CarCostRecordDetail orgCarCostRecordDetail=carCostRecordDetailService.get(costRecordDetail.getId());
						try{
							costRecordDetail.setUpdateTime(now);
							costRecordDetail.setUpdateUser(currentUser.getUsername());
							BeanUtil.copyNotNullProperties(orgCarCostRecordDetail,costRecordDetail);
							carCostRecordDetailService.save(orgCarCostRecordDetail);
						}catch(Exception ex){
							res = false;
							logger.error(ex.getMessage());
						}
					}
		    	}
		    }
		}
		setJsonString("{success:"+res+"}");
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
				carCostRecordDetailService.remove(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

}
