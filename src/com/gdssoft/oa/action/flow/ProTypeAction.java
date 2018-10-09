package com.gdssoft.oa.action.flow;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.flow.ProType;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.flow.ProTypeService;
import com.google.gson.Gson;

/**
 * 
 * @author csx
 * 
 */
public class ProTypeAction extends BaseAction {
	@Resource
	private ProTypeService proTypeService;
	private ProType proType;

	private Long typeId;

	public Long getTypeId() {
		return typeId;
	}

	public void setTypeId(Long typeId) {
		this.typeId = typeId;
	}

	public ProType getProType() {
		return proType;
	}

	public void setProType(ProType proType) {
		this.proType = proType;
	}

	/**
	 * 显示列表,用于数据的显示
	 */
	public String list() {
		List<ProType> processTypeList = proTypeService.getAll();
		StringBuffer sb = new StringBuffer("[");
		for (ProType proType : processTypeList) {
			sb.append("{id:'").append(proType.getTypeId()).append("',text:'")
					.append(proType.getTypeName()).append("',leaf:true},");
		}
		if (!processTypeList.isEmpty()) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		jsonString = sb.toString();

		return SUCCESS;
	}

	public String root() {
		List<ProType> processTypeList = proTypeService.getAll();
		StringBuffer sb = new StringBuffer(
				"[{id:'0',text:'流程分类',leaf:false,expanded:true,children:[");
		AppUser appUser = ContextUtil.getCurrentUser();
		Set<AppRole> appRoles = appUser.getRoles();
		boolean isamin = false;
		for (AppRole appRole : appRoles) {
			if (appRole.getId().equals("-1")) {
				isamin = true;
				break;
			}
		}
		for (ProType proType : processTypeList) {
			if (!isamin) {
				if (proType.getTypeName().equals("系统使用")
						|| proType.getTypeName().equals("测试备份")) {
                   continue;
				}
			}
			sb.append("{id:'").append(proType.getTypeId()).append("',text:'")
					.append(proType.getTypeName()).append("',leaf:true},");
		}
		if (!processTypeList.isEmpty()) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]}]");
		jsonString = sb.toString();

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
				proTypeService.remove(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

	/**
	 * 删除
	 * 
	 * @return
	 */
	public String remove() {
		proTypeService.remove(typeId);
		jsonString = "{success:true}";
		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		ProType proType = proTypeService.get(typeId);

		Gson gson = new Gson();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(proType));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		proTypeService.save(proType);
		setJsonString("{success:true}");
		return SUCCESS;
	}

}
