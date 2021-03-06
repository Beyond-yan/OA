package com.gdssoft.oa.action.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.IndexDisplay;
import com.gdssoft.oa.model.system.PanelItem;
import com.gdssoft.oa.service.system.IndexDisplayService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;


/**
 * 
 * @author 
 *
 */
public class IndexDisplayAction extends BaseAction{
	@Resource
	private IndexDisplayService indexDisplayService;
	private IndexDisplay indexDisplay;
	
	private Long indexId;

	public Long getIndexId() {
		return indexId;
	}

	public void setIndexId(Long indexId) {
		this.indexId = indexId;
	}

	public IndexDisplay getIndexDisplay() {
		return indexDisplay;
	}

	public void setIndexDisplay(IndexDisplay indexDisplay) {
		this.indexDisplay = indexDisplay;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<IndexDisplay> list= indexDisplayService.getAll(filter);
		
		Type type=new TypeToken<List<IndexDisplay>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				indexDisplayService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		IndexDisplay indexDisplay=indexDisplayService.get(indexId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(indexDisplay));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String items=getRequest().getParameter("items");
		Gson gson = new Gson();
		PanelItem[] panelItems = gson.fromJson(items,
				PanelItem[].class);
		AppUser user=ContextUtil.getCurrentUser();
		List<IndexDisplay> list=indexDisplayService.findByUser(user.getUserId());
		for(IndexDisplay id:list){
			indexDisplayService.remove(id);
		}
		for(PanelItem item:panelItems){
			IndexDisplay indexDisplay=new IndexDisplay();
			indexDisplay.setAppUser(user);
			indexDisplay.setPortalId(item.getPanelId());
			indexDisplay.setColNum(item.getColumn());
			indexDisplay.setRowNum(item.getRow());
			indexDisplayService.save(indexDisplay);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
