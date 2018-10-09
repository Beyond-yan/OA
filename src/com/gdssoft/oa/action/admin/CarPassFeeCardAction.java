package com.gdssoft.oa.action.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.CarCardHistory;
import com.gdssoft.oa.model.admin.CarPassFeeCard;
import com.gdssoft.oa.service.admin.CarCardHistoryService;
import com.gdssoft.oa.service.admin.CarPassFeeCardService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class CarPassFeeCardAction extends BaseAction {
	@Resource
	private CarPassFeeCardService carPassFeeCardService;
	@Resource
	private CarCardHistoryService carCardHistoryService;
	private CarPassFeeCard carPassFeeCard;

	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public CarPassFeeCard getCarPassFeeCard() {
		return carPassFeeCard;
	}

	public void setCarPassFeeCard(CarPassFeeCard carPassFeeCard) {
		this.carPassFeeCard = carPassFeeCard;
	}

	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());

    	if(getRequest().getParameter("sort")==null&&getRequest().getParameter("dir")==null)
    	{
    		filter.addSorted("updateDate","desc");
    	}
    	
		List<CarPassFeeCard> list = carPassFeeCardService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "validEDate");
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");
		jsonString = buff.toString();

		logger.debug("GGG DEBUG: " + jsonString);
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
				carPassFeeCardService.unBindWithCar(id);
				carPassFeeCardService.remove(new Long(id));
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
		CarPassFeeCard carPassFeeCard = carPassFeeCardService.get(id);
		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "validEDate");
		buff.append(serializer.exclude(new String[] { "class" }).serialize(
				carPassFeeCard));
		buff.append("}");
		jsonString = buff.toString();
		logger.debug("GGG DEBUG: " + jsonString);
		return SUCCESS;

	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		if (carPassFeeCard.getId() == null) 
		{
			// 检查是否卡号是否已经存在
			QueryFilter filter = new QueryFilter(getRequest());
			filter.addFilter("Q_sn_S_EQ", carPassFeeCard.getSn());
			if (carPassFeeCardService.getAll(filter).size() > 0) 
			{
				setJsonString("{success:false,'msg':'该卡号已经存在'}");
				return SUCCESS;
			}
				
			QueryFilter filterCode = new QueryFilter(getRequest());
			filterCode.addFilter("Q_code_S_EQ", carPassFeeCard.getCode());
			
			if (carPassFeeCardService.getAll(filterCode).size() > 0) 
			{
				setJsonString("{success:false,'msg':'该行政编号已经存在'}");
				return SUCCESS;
			}
			
			carPassFeeCard.setCreateBy(ContextUtil.getCurrentUser().getUsername());
			carPassFeeCard.setCreateDate(new Date());
			carPassFeeCard.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
			carPassFeeCard.setUpdateDate(new Date());
			
			carPassFeeCardService.save(carPassFeeCard);

			CarCardHistory his = new CarCardHistory();
			his.setAmount(carPassFeeCard.getRemains());
			his.setCardId(carPassFeeCard.getId());
			his.setCardType((short) 2); // 1：油卡、2：路费卡
			his.setUseType((short) 1); // 1：储值、2：扣款
			his.setDescription("购卡时的卡内余额");
			his.setUseDate(new java.util.Date());
			
			his.setCreateBy(ContextUtil.getCurrentUser().getUsername());
			his.setCreateDate(new Date());
			his.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
			his.setUpdateDate(new Date());
			
			carCardHistoryService.save(his);

		} else {
			CarPassFeeCard orgCarPassFeeCard = carPassFeeCardService
					.get(carPassFeeCard.getId());
			
			orgCarPassFeeCard.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
			orgCarPassFeeCard.setUpdateDate(new Date());
			
			try 
			{
				BeanUtil.copyNotNullProperties(orgCarPassFeeCard,
						carPassFeeCard);
				carPassFeeCardService.save(orgCarPassFeeCard);

				// 解除与车辆的绑定
				carPassFeeCardService.unBindWithCar(carPassFeeCard.getId()
						.toString());
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}

	public String plusMoney() {
		CarPassFeeCard theCard = carPassFeeCardService.get(carPassFeeCard
				.getId());
		Double oldVal = Double.parseDouble(theCard.getRemains());
		Double plusVal = Double.parseDouble(carPassFeeCard.getRemains());
		oldVal += plusVal;
		theCard.setRemains(oldVal.toString());
		
		theCard.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
		theCard.setUpdateDate(new Date());
		
		carPassFeeCardService.save(theCard);

		CarCardHistory his = new CarCardHistory();
		his.setAmount(plusVal.toString());
		his.setCardId(theCard.getId());
		his.setCardType((short) 2); // 1：油卡、2：路费卡
		his.setUseType((short) 1); // 1：储值、2：扣款
		his.setUseDate(new java.util.Date());
		
		his.setCreateBy(ContextUtil.getCurrentUser().getUsername());
		his.setCreateDate(new Date());
		his.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
		his.setUpdateDate(new Date());
		
		carCardHistoryService.save(his);

		return SUCCESS;
	}

}
