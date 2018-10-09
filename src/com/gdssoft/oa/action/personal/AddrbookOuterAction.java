package com.gdssoft.oa.action.personal;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.personal.AddrbookOuter;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.personal.AddrbookOuterService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

/**
 * 
 * @author
 * 
 */
public class AddrbookOuterAction extends BaseAction {
	@Resource
	private AddrbookOuterService addrbookOuterService;
	private AddrbookOuter addrbookOuter;

	private Long id;
	private File file;
	private String fileFileName;

	private String filesContentType;
	private List<AddrbookOuter> addrbookOuterList = new ArrayList<AddrbookOuter>();

	public String getFilesContentType() {
		return filesContentType;
	}

	public void setFilesContentType(String filesContentType) {
		this.filesContentType = filesContentType;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public String getFileFileName() {
		return fileFileName;
	}

	public void setFileFileName(String fileFileName) {
		this.fileFileName = fileFileName;
	}

	public AddrbookOuter getAddrbookOuter() {
		return addrbookOuter;
	}

	public void setAddrbookOuter(AddrbookOuter addrbookOuter) {
		this.addrbookOuter = addrbookOuter;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		AppUser user = ContextUtil.getCurrentUser();
		String username=user.getUsername();
		if(!user.getIsAdmin()){
			filter.addFilter("Q_createBy_S_EQ", username);
		}
		List<AddrbookOuter> list = addrbookOuterService.getAll(filter);
		Type type = new TypeToken<List<AddrbookOuter>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		Gson gson = new Gson();
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
				addrbookOuterService.remove(new Long(id));
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
		AddrbookOuter addrbookOuter = addrbookOuterService.get(id);

		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(addrbookOuter));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		if (addrbookOuter.getId() == null) {
			addrbookOuter.setCreateBy(ContextUtil.getCurrentUser()
					.getUsername());
			addrbookOuter.setCreateDate(new Date());
			addrbookOuterService.save(addrbookOuter);
		} else {
			AddrbookOuter orgAddrbookOuter = addrbookOuterService
					.get(addrbookOuter.getId());
			addrbookOuter.setUpdateBy(ContextUtil.getCurrentUser()
					.getUsername());
			addrbookOuter.setUpdateDate(new Date());
			try {
				BeanUtil.copyNotNullProperties(orgAddrbookOuter, addrbookOuter);
				addrbookOuterService.save(orgAddrbookOuter);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}

	public void saveExcel2DB() throws IOException {
		// 通过文件流过去要操作Excel的句柄
		FileInputStream fi = new FileInputStream(file);
		// 获取Excel实例
		Workbook wb = this.createWorkBook(fi);
		// 获取Excel实例的第一页
		Sheet sheet = wb.getSheetAt(0);
		int rowNum = sheet.getLastRowNum() + 1;

		// 根据标题获取列数
		Row rowHeader = sheet.getRow(0);
		int totalColNum = rowHeader.getLastCellNum();

		for (int i = 1; i < rowNum; i++) {
			AddrbookOuter bk = new AddrbookOuter();
			bk.setCreateBy(ContextUtil.getCurrentUser().getUsername());
			bk.setCreateDate(new Date());
			bk.setUpdateBy(ContextUtil.getCurrentUser().getUsername());
			bk.setUpdateDate(new Date());

			Row row = sheet.getRow(i);
			for (int j = 0; j < totalColNum; j++) {
				Cell cell = row.getCell(j);
				String cellValue = null;

				if (cell != null) {
					if (cell != null) {

						switch (cell.getCellType()) { // 判断excel单元格内容的格式，并对其进行转换，以便插入数据库

						case 0: // CELL_TYPE_NUMERIC
							cellValue = String.valueOf((long) cell
									.getNumericCellValue());
							break;

						case 1: // CELL_TYPE_STRING
							cellValue = cell.getStringCellValue();
							break;

						case 2: // CELL_TYPE_FORMULA
							cellValue = String.valueOf(cell.getDateCellValue());
							break;

						case 3: // CELL_TYPE_BLANK
							cellValue = "";
							break;
						case 4: // CELL_TYPE_BOOLEAN
							cellValue = String.valueOf(cell
									.getBooleanCellValue());
							break;
						case 5: // CELL_TYPE_ERROR
							cellValue = String
									.valueOf(cell.getErrorCellValue());
							break;

						}
						if (cellValue == null) {
							cellValue = "unknown";
						}

						if (cellValue.isEmpty()) {
							cellValue = "unknown";
						}

						switch (j) {
						case 0:
							bk.setPersonName(cellValue);
							break;
						case 1:
							bk.setPersonSex(cellValue.equals("男") ? (short) 1
									: (short) 2);
							break;
						case 2:
							bk.setCompany(cellValue);
							break;
						case 3:
							bk.setDepartment(cellValue);
							break;
						case 4:
							bk.setRoom(cellValue);
							break;
						case 5:
							bk.setOfficePhone(cellValue);
							break;
						case 6:
							bk.setExt(cellValue);

							break;
						case 7:
							bk.setMobile(cellValue);
							break;
						case 8:
							bk.setShortMobile(cellValue);
							break;
						case 9:
							bk.setEmail(cellValue);
							break;

						}
					}
				}
			}// end of totalColNum

			addrbookOuterList.add(bk);
		}
		for (AddrbookOuter abk : addrbookOuterList) {
			addrbookOuterService.save(abk);
		}
	}

	public String importExcel() throws IOException {
		setJsonString("{success:true}");
		try {
			saveExcel2DB();
		} catch (Exception ex) {
			logger.info(ex.getMessage());
			setJsonString("{success:false}");
		}

		return SUCCESS;
	}

	private Workbook createWorkBook(InputStream is) throws IOException {
		if (this.fileFileName.toLowerCase().endsWith("xls")) {
			return new HSSFWorkbook(is);
		}
		return null;
	}
}
