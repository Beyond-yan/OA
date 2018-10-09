package com.gdssoft.oa.action.admin;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.Car;
import com.gdssoft.oa.model.admin.CarCostRecord;
import com.gdssoft.oa.model.admin.CarCostType;
import com.gdssoft.oa.model.law.Laws;
import com.gdssoft.oa.model.law.LawsAuthor;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.admin.CarCostRecordService;
import com.gdssoft.oa.service.admin.CarCostTypeService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class CarCostTypeAction extends BaseAction {
	@Resource
	private CarCostTypeService carCostTypeService;
	
	@Resource
	private CarCostRecordService carCostRecordService;
	
	private CarCostType carCostType;
	
	
	public CarCostRecordService getCarCostRecordService() {
		return carCostRecordService;
	}

	public void setCarCostRecordService(CarCostRecordService carCostRecordService) {
		this.carCostRecordService = carCostRecordService;
	}

	public CarCostType getCarCostType() {
		return carCostType;
	}

	public void setCarCostType(CarCostType carCostType) {
		this.carCostType = carCostType;
	}

	public CarCostTypeService getCarCostTypeService() {
		return carCostTypeService;
	}

	public void setCarCostTypeService(CarCostTypeService carCostTypeService) {
		this.carCostTypeService = carCostTypeService;
	}

	
	// 删除操作
		public String multiDel() {
			
			String[] ids = getRequest().getParameterValues("carCostTypeId");
			if (ids != null) {
				for (String id : ids) {
					QueryFilter filter = new QueryFilter(getRequest());
					filter.addFilter("Q_costType.id_L_EQ",id);
					carCostType=carCostTypeService.get(Long.valueOf(id));
					List<CarCostRecord> list = carCostRecordService.getAll(filter);
					if(list.size()>0){
			    		this.setJsonString("{success:false,message: '"+carCostType.getCostTypeName()+" 下还有费用，请将费用转移后再删除类型!'}");
			    		return SUCCESS;
			    	}
					carCostTypeService.remove(new Long(id));
				}
			}
			
			
			this.setJsonString("{success:true}");
			return SUCCESS;
			// }

		}

		// 获得详细类别
		public String get() {
			String carCostTypeId = getRequest().getParameter("carCostTypeId");
			carCostType = carCostTypeService.get(Long.parseLong(carCostTypeId));
			StringBuffer sb = new StringBuffer("{success:true,data:");
			JSONSerializer serializer=new JSONSerializer();
			sb.append(serializer.exclude(new String[] { "class" }).serialize(carCostType));
			sb.append("}");
			setJsonString(sb.toString());
			
			return SUCCESS;
		}

	// 类型和名称
	public String listCombo() {
		QueryFilter filter = new QueryFilter(getRequest());
		List<CarCostType> list = carCostTypeService.getAll(filter);
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (CarCostType carCostType : list) {
			sb.append("['").append(carCostType.getId()).append("','")
					.append(carCostType.getCostTypeName()).append("']");
			sb.append(",");
		}
		sb.deleteCharAt(sb.length() - 1);// 删除最后一个","字符
		sb.append("]");
		this.setJsonString(sb.toString());
		return SUCCESS;
	}
	
	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		
		List<CarCostType> list = carCostTypeService.getAll(filter);

		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
		"createTime","updateTime" });
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
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
		if(carCostType.getId()==null){
			carCostType.setCreateTime(now);
			carCostType.setUpdateTime(now);
			carCostType.setCreateUser(currentUser.getUsername());
			carCostType.setUpdateUser(currentUser.getUsername());
			carCostTypeService.save(carCostType);
		}else{
			CarCostType orgCarCost=carCostTypeService.get(carCostType.getId());
			try{
				BeanUtil.copyNotNullProperties(orgCarCost, carCostType);
				carCostType.setUpdateTime(now);
				carCostType.setUpdateUser(currentUser.getUsername());
				carCostTypeService.save(orgCarCost);
			}catch(Exception ex){
				res = false;
				logger.error(ex.getMessage());
			}
		}
		
		setJsonString("{success:"+res+"}");
		return SUCCESS;
	}


}
