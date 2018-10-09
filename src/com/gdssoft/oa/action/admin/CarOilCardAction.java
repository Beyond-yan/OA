package com.gdssoft.oa.action.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Type;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;

import com.gdssoft.oa.model.admin.CarCardHistory;
import com.gdssoft.oa.model.admin.CarOilCard;
import com.gdssoft.oa.model.admin.CarPassFeeCard;
import com.gdssoft.oa.service.admin.CarCardHistoryService;
import com.gdssoft.oa.service.admin.CarOilCardService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class CarOilCardAction extends BaseAction
{
	@Resource
	private CarOilCardService carOilCardService;
	@Resource
	private CarCardHistoryService carCardHistoryService;
	private CarOilCard carOilCard;

	private Long id;

	public Long getId()
	{
		return id;
	}

	public void setId(Long id)
	{
		this.id = id;
	}

	public CarOilCard getCarOilCard()
	{
		return carOilCard;
	}

	public void setCarOilCard(CarOilCard carOilCard)
	{
		this.carOilCard = carOilCard;
	}

	/**
	 * 显示列表
	 */
	public String list()
	{
		QueryFilter filter = new QueryFilter(getRequest());

    	if(getRequest().getParameter("sort")==null&&getRequest().getParameter("dir")==null)
    	{
    		filter.addSorted("updateDate","desc");
    	}
		
		List<CarOilCard> list = carOilCardService.getAll(filter);
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "validEDate");
		buff.append(serializer.exclude(new String[]
		{ "class" }).serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel()
	{

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null)
		{
			for (String id : ids)
			{
				// 解除与车辆的绑定
				carOilCardService.unBindWithCar(id);
				
				carOilCardService.remove(new Long(id));
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
	public String get()
	{
		CarOilCard carOilCard = carOilCardService.get(id);

		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "validEDate");
		buff.append(serializer.exclude(new String[]
		{ "class" }).serialize(carOilCard));
		buff.append("}");
		jsonString = buff.toString();
		logger.debug("GGG DEBUG: " + jsonString);
		return SUCCESS;

	}

	/**
	 * 添加及保存操作
	 */
	public String save()
	{
		if (carOilCard.getId() == null)
		{
			
			// 检查是否卡号是否已经存在
			QueryFilter filter = new QueryFilter(getRequest());
			filter.addFilter("Q_sn_S_EQ", carOilCard.getSn());
			if (carOilCardService.getAll(filter).size() > 0) 
			{
				setJsonString("{success:false,'msg':'该卡号已经存在'}");
				return SUCCESS;
			}
				
			QueryFilter filterCode = new QueryFilter(getRequest());
			filterCode.addFilter("Q_code_S_EQ", carOilCard.getCode());
			
			if (carOilCardService.getAll(filterCode).size() > 0) 
			{
				setJsonString("{success:false,'msg':'该行政编号已经存在'}");
				return SUCCESS;
			}
				
							
			
			
			carOilCard.setCreateBy(ContextUtil.getCurrentUser().getUsername());
			carOilCard.setCreateDate(new Date());
			carOilCard.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
			carOilCard.setUpdateDate(new Date());
			
			carOilCardService.save(carOilCard);
			
			
			CarCardHistory his = new  CarCardHistory();		
			his.setAmount(carOilCard.getRemains());
			his.setCardId(carOilCard.getId());
			his.setCardType((short)1); //1：油卡、2：路费卡
			his.setUseType((short)1);  //1：储值、2：扣款
			his.setDescription("购卡时的卡内余额");
			his.setUseDate(new java.util.Date());	
			
			his.setCreateBy(ContextUtil.getCurrentUser().getUsername());
			his.setCreateDate(new Date());
			his.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
			his.setUpdateDate(new Date());
			
			carCardHistoryService.save(his);
			
		}
		else
		{
			CarOilCard orgCarOilCard = carOilCardService
					.get(carOilCard.getId());
			try
			{				
				BeanUtil.copyNotNullProperties(orgCarOilCard, carOilCard);
				
				orgCarOilCard.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
				orgCarOilCard.setUpdateDate(new Date());
				
				carOilCardService.save(orgCarOilCard);
				
				// 解除与车辆的绑定
				carOilCardService.unBindWithCar(carOilCard.getId().toString());
				
			}
			catch (Exception ex)
			{
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}

	public String addMoney()
	{
		CarOilCard theCard = carOilCardService.get(carOilCard.getId());
		Double oldVal = Double.parseDouble(theCard.getRemains());
		Double newVal = Double.parseDouble(carOilCard.getRemains());
		newVal += oldVal;
		theCard.setRemains(newVal.toString());
		
		theCard.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
		theCard.setUpdateDate(new Date());
		
		carOilCardService.save(theCard);

		CarCardHistory his = new CarCardHistory();
		his.setAmount(carOilCard.getRemains().toString());
		his.setCardId(theCard.getId());
		his.setCardType((short) 1); // 1：油卡、2：路费卡
		his.setUseType((short) 1); // 1：储值、2：扣款
		his.setUseDate(new java.util.Date());
		
		his.setCreateBy(ContextUtil.getCurrentUser().getUsername());
		his.setCreateDate(new Date());
		his.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
		his.setUpdateDate(new Date());
		
		carCardHistoryService.save(his);

		return SUCCESS;
	}

	public String minusMoney()
	{
		CarOilCard theCard = carOilCardService.get(carOilCard.getId());
		Double oldVal = Double.parseDouble(theCard.getRemains());
		Double valToMinus = Double.parseDouble(carOilCard.getRemains());
		if (oldVal < valToMinus)
		{
			return SUCCESS;
		}
		oldVal -= valToMinus;
		theCard.setRemains(oldVal.toString());
		theCard.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
		theCard.setUpdateDate(new Date());
		carOilCardService.save(theCard);

		CarCardHistory his = new CarCardHistory();
		his.setAmount(valToMinus.toString());
		his.setCardId(theCard.getId());
		his.setCardType((short) 1); // 1：油卡、2：路费卡
		his.setUseType((short) 2); // 1：储值、2：扣款
		his.setUseDate(new java.util.Date());
		his.setCreateBy(ContextUtil.getCurrentUser().getUsername());
		his.setCreateDate(new Date());
		his.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
		his.setUpdateDate(new Date());
		
		carCardHistoryService.save(his);

		return SUCCESS;
	}

}
