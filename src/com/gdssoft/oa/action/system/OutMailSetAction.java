package com.gdssoft.oa.action.system;

import java.lang.reflect.Type;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.oa.model.communicate.OutMailUserSeting;
import com.gdssoft.oa.service.communicate.OutMailUserSetingService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;

public class OutMailSetAction extends BaseAction {
	@Resource
	private OutMailUserSetingService outMailUserSetingService;
	private OutMailUserSeting outMailUserSeting;
    public OutMailUserSeting getOutMailUserSeting() {
		return outMailUserSeting;
	}

	public void setOutMailUserSeting(OutMailUserSeting outMailUserSeting) {
		this.outMailUserSeting = outMailUserSeting;
	}

	private Long id;
    
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		List<OutMailUserSeting> list = outMailUserSetingService.getAll(filter);

		Type type = new TypeToken<List<OutMailUserSeting>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		buff.append(gson.toJson(list, type));
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
				outMailUserSetingService.remove(new Long(id));
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

		OutMailUserSeting outMailUserSeting = outMailUserSetingService.get(id);
		Gson gson = new Gson();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");

		if (outMailUserSeting != null) {

			sb.append(gson.toJson(outMailUserSeting));
		} else {
			outMailUserSeting = new OutMailUserSeting();
			outMailUserSeting.setUserId(ContextUtil.getCurrentUserId());
			outMailUserSeting.setUserName(ContextUtil.getCurrentUser()
					.getUsername());

			sb.append(gson.toJson(outMailUserSeting));
		}

		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}
    
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(getId() == null){
		  outMailUserSeting.setUserId(ContextUtil.getCurrentUserId());
		  System.out.println("~~~~"+ContextUtil.getCurrentUserId());
		  outMailUserSetingService.save(outMailUserSeting);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

}
