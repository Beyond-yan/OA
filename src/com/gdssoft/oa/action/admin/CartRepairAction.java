package com.gdssoft.oa.action.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.admin.CartRepair;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.admin.CartRepairService;

import flexjson.JSONSerializer;

/**
 * 
 * @author csx
 * 
 */
public class CartRepairAction extends BaseAction {
	@Resource
	private CartRepairService cartRepairService;
	private CartRepair cartRepair;

	private Long repairId;

	public Long getRepairId() {
		return repairId;
	}

	public void setRepairId(Long repairId) {
		this.repairId = repairId;
	}

	public CartRepair getCartRepair() {
		return cartRepair;
	}

	public void setCartRepair(CartRepair cartRepair) {
		this.cartRepair = cartRepair;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		List<CartRepair> list = cartRepairService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer serializer = JsonUtil.getJSONSerializer(new String[] {
				"repairDate", "endDt" });
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
				CartRepair cartRepair = cartRepairService.get(Long.valueOf(id));
				cartRepairService.updateCarStatus(cartRepair.getCar()
						.getCarid());
				cartRepairService.remove(new Long(id));
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
		CartRepair cartRepair = cartRepairService.get(repairId);
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = JsonUtil.getJSONSerializer(new String[] {
				"repairDate", "endDt" });
		sb.append(serializer.exclude(
				new String[] { "class", "car.cartRepairs", }).serialize(
				cartRepair));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}

	/**
	 * 
	 * 添加及保存操作
	 * 
	 */
	public String save() {
		// 开始时间大于结束时间
		if (cartRepair.getRepairDate().getTime() > cartRepair.getEndDt()
				.getTime()) {
			setJsonString("{result:1}");
			return SUCCESS;
		}
		cartRepair.setStatus(new Short("1"));
		cartRepair.setCreateDate(new Date());
		cartRepair.setUpdateDate(new Date());
		AppUser currentUser = ContextUtil.getCurrentUser();
		cartRepair.setCreateBy(currentUser.getUsername());
		cartRepair.setUpdateBy(currentUser.getUsername());
		cartRepairService.save(cartRepair);
		if (StringUtils.isNotBlank(cartRepair.getRepairType())) {
			cartRepairService.updateCarStatus(cartRepair.getCarId(), 2);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
