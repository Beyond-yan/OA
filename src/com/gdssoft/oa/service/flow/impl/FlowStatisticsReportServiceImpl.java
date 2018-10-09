package com.gdssoft.oa.service.flow.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFCellUtil;
import org.apache.poi.hssf.util.Region;
import org.apache.poi.hwpf.usermodel.Range;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.PrintSetup;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.struts2.ServletActionContext;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.flow.FlowStatisticsReportDao;
import com.gdssoft.oa.dao.flow.ProcessFormDao;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.reports.ComPanyReport;
import com.gdssoft.oa.model.reports.DepartmentReport;
import com.gdssoft.oa.model.reports.ReceiveReport;
import com.gdssoft.oa.model.reports.SendReport;
import com.gdssoft.oa.service.flow.FlowStatisticsReportService;
import com.gdssoft.oa.util.DwonLoadAction;

public class FlowStatisticsReportServiceImpl extends BaseServiceImpl<ComPanyReport> implements FlowStatisticsReportService {
	private FlowStatisticsReportDao dao;
	private Log logger = LogFactory.getLog(FlowStatisticsReportServiceImpl.class);
	public FlowStatisticsReportServiceImpl(FlowStatisticsReportDao dao) {
		super(dao);
		this.dao=dao;
	}
	@Override
	public List<ComPanyReport> queryReportByCompany(String beginDate, String endDate) {
		// TODO Auto-generated method stub
		return dao.queryReportByCompany(beginDate, endDate);
	}
	
	@Override
	public List<DepartmentReport> queryReportByDepartment(String depName, String beginDate, String endDate) {
		// TODO Auto-generated method stub
		return dao.queryReportByDepartment(depName, beginDate, endDate);
	} 
	
	@Override
	public List<ReceiveReport> queryReportByReceive(String depName, String flowName, String flowStatus, String beginDate,
			String endDate,String overDateFlag) {
		// TODO Auto-generated method stub
		return dao.queryReportByReceive(depName, flowName, flowStatus, beginDate, endDate,overDateFlag);
	}
	
	
    
	 /**
		 * 导出公司级别报表
		 */
	@Override
	public InputStream listToCompExcel(List<ComPanyReport> list, String beginDate, String endDate, String staticsDate) {

		logger.info("staticsDate:"+staticsDate);
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("公司级：公文处理情况汇总表");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$M$1"));
			
			Region region= new Region(0, (short)0, 1, (short)12);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			// header row 第2行
			Row headerRow = sheet1.createRow(1);
			headerRow.setHeightInPoints(20);
			Cell headerCell1;
			//header1 第1列
			headerCell1 = headerRow.createCell(0);
			headerCell1.setCellValue("");
			headerCell1.setCellStyle(styles.get("header"));
			//header1 第2列
			headerCell1 = headerRow.createCell(1);
			headerCell1.setCellValue("起始时间:"+beginDate+"     "+"截止时间:"+endDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$B$2:$G$2"));
			//header1 第3列
			headerCell1 = headerRow.createCell(7);
			headerCell1.setCellValue("统计时间:"+staticsDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$H$2:$M$2"));
			
			Region region0= new Region(1, (short)1, 2, (short)12);
			this.setRegionStyle(sheet1, region0, styles.get("header"));
			
			
			// header2 row 第3行
			Row headerRow2 = sheet1.createRow(2);
			headerRow2.setHeightInPoints(20);
			Cell headerCell2;
			//第3行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("部门");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$3:$A$4"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("发文");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$B$3:$G$3"));
			headerCell2 = headerRow2.createCell(7);
			headerCell2.setCellValue("收文");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$H$3:$M$3"));
			
			Row headerRow3 = sheet1.createRow(3);
			headerRow3.setHeightInPoints(40);
			Cell headerCell3;
			//第4行  第1列
			headerCell3 = headerRow3.createCell(0);
			headerCell3.setCellValue("");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(1);
			headerCell3.setCellValue("已完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(2);
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3.setCellValue("进行中");
			headerCell3 = headerRow3.createCell(3);
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3.setCellValue("超过2天未完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(4);
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3.setCellValue("超过3天未完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(5);
			headerCell3.setCellValue("合计");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(6);
			headerCell3.setCellValue("完成率");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(7);
			headerCell3.setCellValue("已完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(8);
			headerCell3.setCellValue("进行中");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(9);
			headerCell3.setCellValue("超过2天未完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(10);
			headerCell3.setCellValue("超过3天未完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(11);
			headerCell3.setCellValue("合计");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(12);
			headerCell3.setCellValue("完成率");
			headerCell3.setCellStyle(styles.get("header"));
			
			Region region2= new Region(2, (short)1, 3, (short)12);
			this.setRegionStyle(sheet1, region2, styles.get("header"));
			
			int rownum = 4;
			/* for (int i = 0; i < 13; i++) {
		            Row row = sheet1.createRow(rownum++);
		            for (int j = 0; j < 11; j++) {
		                Cell cell = row.createCell(j);
		                if(j == 5){
		                	cell.setCellFormula("B" +rownum+ "/E" + rownum);
		                } else if (j == 10){
		                	cell.setCellFormula("G" +rownum+ "/J" + rownum);
		                } else {
		                    cell.setCellStyle(styles.get("cell"));
		                }
		            }
		     }*/
			
			
			
			
			Cell cell = null;
			for (ComPanyReport iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 13; j++) {
	                cell = row.createCell(j);
	                if(j==0){
	                	cell.setCellValue(iter.getDepName());
	                }else if(j == 1){
	                	cell.setCellValue(iter.getFinish());
	                }else if(j == 2){
	                	cell.setCellValue(iter.getNotFinish1());
	                }else if(j == 3){
	                	cell.setCellValue(iter.getNotFinsih2());
	                }else if(j == 4){
	                	cell.setCellValue(iter.getNotFinsih3());
	                }else if(j == 5){
	                	cell.setCellValue(iter.getTotal());
	                }else if(j == 6){
	                	int rown = rownum+1;
	                	if(iter.getTotal().equals("0")){
	                		cell.setCellValue(0);
	                		cell.setCellStyle(styles.get("formula"));
	                	}else{
	                		//cell.setCellFormula("B" +rown+ "/E" + rown);
	                		DecimalFormat   fmt   =   new   DecimalFormat( "#% "); 
	                		Double value = Double.valueOf(iter.getFinish())/Double.valueOf(iter.getTotal());
	                		cell.setCellValue(fmt.format((value)));
	                		//cell.setCellStyle(styles.get("formula"));

	                	}
	                }else if(j == 7){
	                	cell.setCellValue(iter.getRecFinish());
	                }else if(j == 8){
	                	cell.setCellValue(iter.getRecNotFinish1());
	                }else if(j == 9){
	                	cell.setCellValue(iter.getRecNotFinish2());
	                }else if(j == 10){
	                	cell.setCellValue(iter.getRecNotFinish3());
	                } else if(j == 11){
	                	cell.setCellValue(iter.getRecTotal());
	                } else if (j == 12){
	                	int rown = rownum+1;
	                	if(iter.getRecTotal().equals("0")){
	                		cell.setCellValue(0);
	                		cell.setCellStyle(styles.get("formula"));
	                	}else{
	                		//cell.setCellFormula("G" +rown+ "/J" + rown);
	                		DecimalFormat   fmt   =   new   DecimalFormat( "#% "); 
	                		Double value = Double.valueOf(iter.getRecFinish())/Double.valueOf(iter.getRecTotal());
	                		cell.setCellValue(fmt.format((value)));
	                		//cell.setCellStyle(styles.get("formula"));
	                	}
	                } 
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			
			//sheet1.setColumnWidth(0, (short)50);
			sheet1.autoSizeColumn(3); //adjust width of the second column
			sheet1.autoSizeColumn(8); //adjust width of the second column
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
	            try {
	                 wb.write(os);
	                  os.close();
	            } catch (IOException e) {
	            	e.printStackTrace();
	            }

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			
	       try {
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	
	}
	 /**
	 * 导出部门级别报表
	 */
	@Override
	public InputStream listToDeptExcel(List<DepartmentReport> list, String depName, String beginDate, String endDate,
			String staticsDate) {
		logger.info("------coming into listToDeptExcel methods---------");
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("部门级：公文处理情况汇总表");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$L$1"));
			
			Region region= new Region(0, (short)0, 1, (short)11);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			// header row 第2行
			Row headerRow = sheet1.createRow(1);
			headerRow.setHeightInPoints(20);
			Cell headerCell1;
			//header1 第1列
			headerCell1 = headerRow.createCell(0);
			headerCell1.setCellValue("");
			headerCell1.setCellStyle(styles.get("header"));
			//header1 第2列
			headerCell1 = headerRow.createCell(1);
			headerCell1.setCellValue("");
			headerCell1.setCellStyle(styles.get("header"));
			
			//header1 第3列
			headerCell1 = headerRow.createCell(2);
			headerCell1.setCellValue("起始时间:"+beginDate+"     "+"截止时间:"+endDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$C$2:$G$2"));
			//header1 第4列
			headerCell1 = headerRow.createCell(7);
			headerCell1.setCellValue("统计时间:"+staticsDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$H$2:$L$2"));
			
			Region region0= new Region(1, (short)1, 2, (short)11);
			this.setRegionStyle(sheet1, region0, styles.get("header"));
			
			
			// header2 row 第3行
			Row headerRow2 = sheet1.createRow(2);
			headerRow2.setHeightInPoints(20);
			Cell headerCell2;
			//第3行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("部门");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$3:$A$4"));
			
			//第3行  第2列
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("流程名称");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$B$3:$B$4"));
			
			headerCell2 = headerRow2.createCell(2);
			headerCell2.setCellValue("发文");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$C$3:$G$3"));
			headerCell2 = headerRow2.createCell(7);
			headerCell2.setCellValue("收文");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$H$3:$L$3"));
			
			Row headerRow3 = sheet1.createRow(3);
			headerRow3.setHeightInPoints(40);
			Cell headerCell3;
			//第4行  第1列
			headerCell3 = headerRow3.createCell(0);
			headerCell3.setCellValue("");
			headerCell3 = headerRow3.createCell(1);
			headerCell3.setCellValue("");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(2);
			headerCell3.setCellValue("已完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(3);
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3.setCellValue("进行中");
			headerCell3 = headerRow3.createCell(4);
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3.setCellValue("超过3天未完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(5);
			headerCell3.setCellValue("合计");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(6);
			headerCell3.setCellValue("完成率");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(7);
			headerCell3.setCellValue("已完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(8);
			headerCell3.setCellValue("进行中");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(9);
			headerCell3.setCellValue("超过3天未完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(10);
			headerCell3.setCellValue("合计");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(11);
			headerCell3.setCellValue("完成率");
			headerCell3.setCellStyle(styles.get("header"));
			
			Region region2= new Region(2, (short)1, 3, (short)11);
			this.setRegionStyle(sheet1, region2, styles.get("header"));
			
			int rownum = 4;
			/* for (int i = 0; i < 13; i++) {
		            Row row = sheet1.createRow(rownum++);
		            for (int j = 0; j < 11; j++) {
		                Cell cell = row.createCell(j);
		                if(j == 5){
		                	cell.setCellFormula("B" +rownum+ "/E" + rownum);
		                } else if (j == 10){
		                	cell.setCellFormula("G" +rownum+ "/J" + rownum);
		                } else {
		                    cell.setCellStyle(styles.get("cell"));
		                }
		            }
		     }*/
			
			
			
			Cell cell = null;
			String depNameTemp = "";
			int count = 0;
			int beginPointer = 5;
			for (DepartmentReport iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 12; j++) {
	                cell = row.createCell(j);
	                if(j==0){
	                	if(depNameTemp.equals("")){
	                		cell.setCellValue(iter.getDepName());
	                		depNameTemp = iter.getDepName();
	                		count ++;
	                	}else if(depNameTemp.equals(iter.getDepName())){
	                		cell.setCellValue("");
	                		count ++;
	                	}else if(!depNameTemp.equals(iter.getDepName())){
	                		int endPointer = beginPointer+count-1;
	                		String mergeRegion = "$A"+beginPointer + ":" + "$A"+endPointer;
	                		sheet1.addMergedRegion(CellRangeAddress.valueOf(mergeRegion));
	                		depNameTemp = iter.getDepName();
	                		beginPointer = beginPointer + count;
	                		cell.setCellValue(iter.getDepName());
	                		count = 1;
	                	}
	                }else if(j == 1){
	                	cell.setCellValue(iter.getFileName());
	                }else if(j == 2){
	                	cell.setCellValue(iter.getFinish());
	                }else if(j == 3){
	                	cell.setCellValue(iter.getNotFinish1());
	                }else if(j == 4){
	                	cell.setCellValue(iter.getNotFinsih2());
	                }else if(j == 5){
	                	cell.setCellValue(iter.getTotal());
	                }else if(j == 6){
	                	int rown = rownum+1;
	                	if(iter.getTotal().equals("0")){
	                		cell.setCellValue(0);
	                		cell.setCellStyle(styles.get("formula"));
	                	}else{
	                		DecimalFormat   fmt   =   new   DecimalFormat( "#% "); 
	                		Double value = Double.valueOf(iter.getFinish())/Double.valueOf(iter.getTotal());
	                		cell.setCellValue(fmt.format((value)));
	                	}
	                }else if(j == 7){
	                	cell.setCellValue(iter.getRecFinish());
	                }else if(j == 8){
	                	cell.setCellValue(iter.getRecNotFinish1());
	                }else if(j == 9){
	                	cell.setCellValue(iter.getRecNotFinish2());
	                }else if(j == 10){
	                	cell.setCellValue(iter.getRecTotal());
	                } else if (j == 11){
	                	int rown = rownum+1;
	                	if(iter.getRecTotal().equals("0")){
	                		cell.setCellValue(0);
	                		cell.setCellStyle(styles.get("formula"));
	                	}else{
	                		DecimalFormat   fmt   =   new   DecimalFormat( "#% "); 
	                		Double value = Double.valueOf(iter.getRecFinish())/Double.valueOf(iter.getRecTotal());
	                		cell.setCellValue(fmt.format((value)));
	                	}
	                } 
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			int endPointer = beginPointer+count-1;
			logger.info("count:"+count);
			String mergeRegion = "$A"+beginPointer + ":" + "$A"+endPointer;
			logger.info("mergeRegion"+mergeRegion);
			sheet1.addMergedRegion(CellRangeAddress.valueOf(mergeRegion));
			//sheet1.setColumnWidth(0, (short)100);
			//sheet1.setColumnWidth(1, (short)100);
			//sheet1.autoSizeColumn(0); //adjust width of the second column
			sheet1.autoSizeColumn(1); //adjust width of the second column
			sheet1.autoSizeColumn(4); //adjust width of the second column
			sheet1.autoSizeColumn(9); //adjust width of the second column
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
	            try {
	                 wb.write(os);
	                  os.close();
	            } catch (IOException e) {
	            	e.printStackTrace();
	            }

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			
	       try {
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	}
	
	/**
	 * 导出部收文统计报表
	 */
	@Override
	public InputStream listToReceiveExcel(List<ReceiveReport> list, String beginDate, String endDate, String staticsDate) {

		logger.info("------coming into listToReceiveExcel methods---------");
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("收文报表统计");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$K$1"));
			
			Region region= new Region(0, (short)0, 1, (short)10);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			// header row 第2行
			Row headerRow = sheet1.createRow(1);
			headerRow.setHeightInPoints(20);
			Cell headerCell1;
			//header1 第1列
			headerCell1 = headerRow.createCell(0);
			headerCell1.setCellValue("");
			headerCell1.setCellStyle(styles.get("header"));
			
			//header1 第3列
			headerCell1 = headerRow.createCell(1);
			headerCell1.setCellValue("起始时间:"+beginDate+"     "+"截止时间:"+endDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$B$2:$F$2"));
			//header1 第4列
			headerCell1 = headerRow.createCell(6);
			headerCell1.setCellValue("统计时间:"+staticsDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$G$2:$K$2"));
			
			Region region0= new Region(1, (short)1, 2, (short)10);
			this.setRegionStyle(sheet1, region0, styles.get("header"));
			
			
			// header2 row 第3行
			Row headerRow2 = sheet1.createRow(2);
			headerRow2.setHeightInPoints(40);
			Cell headerCell2;
			//第4行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("收文部门");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("流程名称");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(2);
			headerCell2.setCellValue("主题");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2.setCellValue("发文部门");
			headerCell2 = headerRow2.createCell(4);
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2.setCellValue("发起人");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(5);
			headerCell2.setCellValue("发起时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(6);
			headerCell2.setCellValue("收文时间（文件到达部门时间）");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(7);
			headerCell2.setCellValue("当前处理人");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(8);
			headerCell2.setCellValue("状态（已完成/未完成");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(9);
			headerCell2.setCellValue("结束时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(10);
			headerCell2.setCellValue("处理时长（天）");
			headerCell2.setCellStyle(styles.get("header"));
			
			int rownum = 3;
			
			Cell cell = null;
			String depNameTemp = "";
			int count = 0;
			int beginPointer = 4;
			int mergeRowNum = 0;
			for (ReceiveReport iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 11; j++) {
	                cell = row.createCell(j);
	                if(j==0){
	                	if(depNameTemp.equals("")){
	                		cell.setCellValue(iter.getRecDep());
	                		depNameTemp = iter.getRecDep();
	                		count ++;
	                	}else if(depNameTemp.equals(iter.getRecDep())){
	                		cell.setCellValue("");
	                		count ++;
	                	}else if(!depNameTemp.equals(iter.getRecDep())){
	                		int endPointer = beginPointer+count-1;
	                		String mergeRegion = "$A"+beginPointer + ":" + "$A"+endPointer;
	                		mergeRowNum ++;
	                		sheet1.addMergedRegion(CellRangeAddress.valueOf(mergeRegion));
	                		//设置合并单元格的样式
	                		/*if(mergeRowNum % 2 ==0) {
	                			for(int i=beginPointer;i<=endPointer;i++){
		                			HSSFRow row_temp = HSSFCellUtil.getRow(i, sheet1);
	                                HSSFCell cell_temp = HSSFCellUtil.getCell(row_temp,0);
	                                if(cell_temp ==null ){
	                                    cell_temp = row_temp.createCell(0);
	                                }
	                                cell_temp.setCellStyle(styles.get("header"));
	                                logger.info("--------set color--------");

		                		}
	                		}*/
	                		depNameTemp = iter.getRecDep();
	                		beginPointer = beginPointer + count;
	                		cell.setCellValue(iter.getRecDep());
	                		count = 1;
	                	}
	                }else if(j == 1){
	                	cell.setCellValue(iter.getName());
	                }else if(j == 2){
	                	cell.setCellValue(iter.getSubject());
	                }else if(j == 3){
	                	cell.setCellValue(iter.getSendDep());
	                }else if(j == 4){
	                	cell.setCellValue(iter.getSender());
	                }else if(j == 5){
	                	cell.setCellValue(iter.getSendTime());
	                }else if(j == 6){
	                	cell.setCellValue(iter.getRecTime());
	                }else if(j == 7){
	                	cell.setCellValue(iter.getAssigner());
	                }else if(j == 8){
	                	cell.setCellValue(iter.getStatus());
	                }else if(j == 9){
	                	cell.setCellValue(iter.getFinishTime());
	                }else if(j == 10){
	                	String dealTime = convertDealTime(iter.getDealTime());
	                	cell.setCellValue(dealTime);
	                } 
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			int endPointer = beginPointer+count-1;
			logger.info("count:"+count);
			String mergeRegion = "$A"+beginPointer + ":" + "$A"+endPointer;
			logger.info("mergeRegion"+mergeRegion);
			sheet1.addMergedRegion(CellRangeAddress.valueOf(mergeRegion));
			sheet1.autoSizeColumn(1); //adjust width of the second column
			sheet1.autoSizeColumn(2); //adjust width of the second column
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
	            try {
	                 wb.write(os);
	                  os.close();
	            } catch (IOException e) {
	            	e.printStackTrace();
	            }

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			
	       try {
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	
	}
	private String convertDealTime(String dealTime) {
		if(dealTime.equals("")){
			dealTime ="0";
		}
		int dealTimeTemp = Integer.valueOf(dealTime);
		String result = "";
		if(dealTimeTemp == 0){
			result = "";
		}else if(dealTimeTemp < 60){
			result = result +"分钟";
		}else if(dealTimeTemp >=60 && dealTimeTemp < 1440){
			int hour = dealTimeTemp / 60;
			int minute  = dealTimeTemp % 60;
			result = hour  +"小时" +minute + "分钟";
		}
		else if(dealTimeTemp >= 1440 && dealTimeTemp <43200){
			int day = dealTimeTemp / 1440;
			result = day +"天";
			int yushu = dealTimeTemp % 1440 ;
			if(yushu!=0){
				if(yushu <60){
					result = result + yushu  + "分钟";
				}else {
					int hour = yushu / 60;
					int minute  = yushu % 60;
					result = result + hour  + "小时" +minute +"分钟";
				}
			}
		}else if(dealTimeTemp>=43200){
			int month = dealTimeTemp/43200;
			result = month +"月";
			int yushu = dealTimeTemp % 43200 ;
			if(yushu!=0){
				if(yushu <60){
					result = result + yushu  + "分钟";
				}else if(yushu >=60 && yushu <1440){
					int hour = yushu / 60;
					int minute  = yushu % 60;
					result = result + hour  + "小时" +minute +"分钟";
				}else if(yushu >=1440){
					int day = yushu / 1440;
					int yushu2 = yushu % 1440;
					int hour = yushu2 / 60;
					int minute  = yushu2 % 60;
					result = result + day +"天" + hour  + "小时" +minute +"分钟";
				}
			}
		
			
		}
		return result;
	}
	
	private void setRegionStyle(HSSFSheet sheet, Region region , CellStyle cs) {
        int toprowNum = region.getRowFrom();
        for (int i = region.getRowFrom(); i <= region.getRowTo(); i ++) {
            HSSFRow row = HSSFCellUtil.getRow(i, sheet);
            for (int j = region.getColumnFrom(); j <= region.getColumnTo(); j++) {
                HSSFCell cell = HSSFCellUtil.getCell(row, (short)j);
                cell.setCellStyle(cs);
            }
        }
    }
	/**
	 * Create a library of cell styles
	 */
	private static Map<String, CellStyle> createStyles(Workbook wb) {
		Map<String, CellStyle> styles = new HashMap<String, CellStyle>();
		CellStyle style;
		Font titleFont = wb.createFont();
		titleFont.setFontHeightInPoints((short) 14);
		titleFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFont(titleFont);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("title", style);

		Font monthFont = wb.createFont();
		monthFont.setFontHeightInPoints((short) 11);
		//monthFont.setColor(IndexedColors.WHITE.getIndex());
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setFont(monthFont);
		style.setWrapText(true);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("header", style);

		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setWrapText(true);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("cell", style);

		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setDataFormat(wb.createDataFormat().getFormat("0.00%"));
		styles.put("formula", style);

		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setDataFormat(wb.createDataFormat().getFormat("0.00"));
		styles.put("formula_2", style);
		//第0列样式
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setWrapText(true);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("cell0", style);

		return styles;
	}
	 public   static   void   main(String   args[])   { 
         double   test   =   0.354123; 
         DecimalFormat   fmt   =   new   DecimalFormat( "#% "); 
         System.out.println(fmt.format((test))); 
     }
	@Override
	public List<SendReport> queryReportBySend(String depName, String flowName, String flowStatus, String beginDate,
			String endDate, String overDateFlag) {
		// TODO Auto-generated method stub
		return dao.queryReportBySend(depName, flowName, flowStatus, beginDate, endDate, overDateFlag);
	}
	@Override
	public InputStream listToRSendExcel(List<SendReport> list, String beginDate, String endDate, String staticsDate) {

		logger.info("------coming into listToRSendExcel methods---------");
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("发文报表统计");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$J$1"));
			
			Region region= new Region(0, (short)0, 1, (short)9);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			// header row 第2行
			Row headerRow = sheet1.createRow(1);
			headerRow.setHeightInPoints(20);
			Cell headerCell1;
			//header1 第1列
			headerCell1 = headerRow.createCell(0);
			headerCell1.setCellValue("");
			headerCell1.setCellStyle(styles.get("header"));
			
			//header1 第3列
			headerCell1 = headerRow.createCell(1);
			headerCell1.setCellValue("起始时间:"+beginDate+"     "+"截止时间:"+endDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$B$2:$F$2"));
			//header1 第4列
			headerCell1 = headerRow.createCell(6);
			headerCell1.setCellValue("统计时间:"+staticsDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$G$2:$J$2"));
			
			Region region0= new Region(1, (short)1, 2, (short)9);
			this.setRegionStyle(sheet1, region0, styles.get("header"));
			
			
			// header2 row 第3行
			Row headerRow2 = sheet1.createRow(2);
			headerRow2.setHeightInPoints(40);
			Cell headerCell2;
			//第4行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("发文部门");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("主题");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(2);
			headerCell2.setCellValue("流程名称");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2.setCellValue("发起人");
			headerCell2 = headerRow2.createCell(4);
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2.setCellValue("发起时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(5);
			headerCell2.setCellValue("当前处理人");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(6);
			headerCell2.setCellValue("状态（已完成/未完成）");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(7);
			headerCell2.setCellValue("发文完成时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(8);
			headerCell2.setCellValue("处理时长（天）");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(9);
			headerCell2.setCellValue("收文状态");
			headerCell2.setCellStyle(styles.get("header"));
			
			int rownum = 3;
			
			Cell cell = null;
			String depNameTemp = "";
			int count = 0;
			int beginPointer = 4;
			int mergeRowNum = 0;
			for (SendReport iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 10; j++) {
	                cell = row.createCell(j);
	                if(j==0){
	                	if(depNameTemp.equals("")){
	                		cell.setCellValue(iter.getSendDep());
	                		depNameTemp = iter.getSendDep();
	                		count ++;
	                	}else if(depNameTemp.equals(iter.getSendDep())){
	                		cell.setCellValue("");
	                		count ++;
	                	}else if(!depNameTemp.equals(iter.getSendDep())){
	                		int endPointer = beginPointer+count-1;
	                		String mergeRegion = "$A"+beginPointer + ":" + "$A"+endPointer;
	                		mergeRowNum ++;
	                		sheet1.addMergedRegion(CellRangeAddress.valueOf(mergeRegion));
	                		//设置合并单元格的样式
	                		/*if(mergeRowNum % 2 ==0) {
	                			for(int i=beginPointer;i<=endPointer;i++){
		                			HSSFRow row_temp = HSSFCellUtil.getRow(i, sheet1);
	                                HSSFCell cell_temp = HSSFCellUtil.getCell(row_temp,0);
	                                if(cell_temp ==null ){
	                                    cell_temp = row_temp.createCell(0);
	                                }
	                                cell_temp.setCellStyle(styles.get("header"));
	                                logger.info("--------set color--------");

		                		}
	                		}*/
	                		depNameTemp = iter.getSendDep();
	                		beginPointer = beginPointer + count;
	                		cell.setCellValue(iter.getSendDep());
	                		count = 1;
	                	}
	                }else if(j == 1){
	                	cell.setCellValue(iter.getSubject());
	                }else if(j == 2){
	                	cell.setCellValue(iter.getName());
	                }else if(j == 3){
	                	cell.setCellValue(iter.getSender());
	                }else if(j == 4){
	                	cell.setCellValue(iter.getSendTime());
	                }else if(j == 5){
	                	cell.setCellValue(iter.getAssigner());
	                }else if(j == 6){
	                	cell.setCellValue(iter.getSendStatus());
	                }else if(j == 7){
	                	cell.setCellValue(iter.getSendFinishTime());
	                }/*else if(j == 8){
	                	cell.setCellValue(iter.getSendFinishTime());
	                }*/else if(j == 8){
	                	String dealTime = convertDealTime(iter.getSendDealTime());
	                	cell.setCellValue(dealTime);
	                }else if(j == 9){
	                	cell.setCellValue(iter.getReceiveStatus());
	                } 
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			int endPointer = beginPointer+count-1;
			logger.info("count:"+count);
			String mergeRegion = "$A"+beginPointer + ":" + "$A"+endPointer;
			logger.info("mergeRegion"+mergeRegion);
			sheet1.addMergedRegion(CellRangeAddress.valueOf(mergeRegion));
			sheet1.autoSizeColumn(1); //adjust width of the second column
			sheet1.autoSizeColumn(2); //adjust width of the second column
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
	            try {
	                 wb.write(os);
	                  os.close();
	            } catch (IOException e) {
	            	e.printStackTrace();
	            }

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			
	       try {
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	
	}
	@Override
	public List<ComPanyReport> queryReportByCompanyStep(String beginDate,
			String endDate) {
		return dao.queryReportByCompanyStep(beginDate, endDate);
	}
	
	/**
	 * 导出公司级别超时报表
	 */
	@Override
	public InputStream listToCompStepExcel(List<ComPanyReport> list,
			String beginDate, String endDate, String staticsDate) {

		logger.info("staticsDate:" + staticsDate);
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is = null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("公司级：公文处理情况汇总表");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$G$1"));

			//边框
			Region region = new Region(0, (short) 0, 1, (short) 6);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			// header row 第2行
			Row headerRow = sheet1.createRow(1);
			headerRow.setHeightInPoints(20);
			Cell headerCell1;
			// header1 第1列
			headerCell1 = headerRow.createCell(0);
			headerCell1.setCellValue("");
			headerCell1.setCellStyle(styles.get("header"));
			// header1 第2列
			headerCell1 = headerRow.createCell(1);
			headerCell1.setCellValue("起始时间:" + beginDate + "     " + "截止时间:"
					+ endDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$B$2:$D$2"));
			// header1 第3列
			headerCell1 = headerRow.createCell(4);
			headerCell1.setCellValue("统计时间:" + staticsDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$E$2:$G$2"));

			//边框
			Region region0 = new Region(1, (short) 1, 2, (short) 6);
			this.setRegionStyle(sheet1, region0, styles.get("header"));

			// header2 row 第3行
			Row headerRow2 = sheet1.createRow(2);
			headerRow2.setHeightInPoints(20);
			Cell headerCell2;
			// 第3行 第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("部门");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$3:$A$4"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("发文");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$B$3:$D$3"));
			headerCell2 = headerRow2.createCell(4);
			headerCell2.setCellValue("收文");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$E$3:$G$3"));

			Row headerRow3 = sheet1.createRow(3);
			headerRow3.setHeightInPoints(40);
			Cell headerCell3;
			// 第4行 第1列
			headerCell3 = headerRow3.createCell(0);
			headerCell3.setCellValue("");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(1);
			headerCell3.setCellValue("超过3天(工作日)已完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(2);
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3.setCellValue("超过3天(工作日)未完成");
			headerCell3 = headerRow3.createCell(3);
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3.setCellValue("合计");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(4);
			headerCell3.setCellValue("超过3天(工作日)已完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(5);
			headerCell3.setCellValue("超过3天(工作日)未完成");
			headerCell3.setCellStyle(styles.get("header"));
			headerCell3 = headerRow3.createCell(6);
			headerCell3.setCellValue("合计");
			headerCell3.setCellStyle(styles.get("header"));
			
			sheet1.setColumnWidth(0, (short)5000);
			sheet1.setColumnWidth(1, (short)7000);
			sheet1.setColumnWidth(2, (short)7000);
			sheet1.setColumnWidth(3, (short)3000);
			sheet1.setColumnWidth(4, (short)7000);
			sheet1.setColumnWidth(5, (short)7000);
			sheet1.setColumnWidth(6, (short)3000);
			
			//边框
			Region region2 = new Region(2, (short) 1, 3, (short) 6);
			this.setRegionStyle(sheet1, region2, styles.get("header"));

			int rownum = 4;
			/*
			 * for (int i = 0; i < 13; i++) { Row row =
			 * sheet1.createRow(rownum++); for (int j = 0; j < 11; j++) { Cell
			 * cell = row.createCell(j); if(j == 5){ cell.setCellFormula("B"
			 * +rownum+ "/E" + rownum); } else if (j == 10){
			 * cell.setCellFormula("G" +rownum+ "/J" + rownum); } else {
			 * cell.setCellStyle(styles.get("cell")); } } }
			 */

			Cell cell = null;
			for (ComPanyReport iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 7; j++) {
					cell = row.createCell(j);
					if (j == 0) {
						cell.setCellValue(iter.getDepName());
					} else if (j == 1) {
						cell.setCellValue(iter.getSendFinish());
					} else if (j == 2) {
						cell.setCellValue(iter.getSendNotFinish1());
					} else if (j == 3) {
						cell.setCellValue(iter.getSendTotal());
					} else if (j == 4) {
						cell.setCellValue(iter.getRecFinish());
					} else if (j == 5) {
						cell.setCellValue(iter.getRecNotFinish1());
					} else if (j == 6) {
						cell.setCellValue(iter.getRecTotal());
					}
					cell.setCellStyle(styles.get("cell"));
				}
				rownum++;
			}

			// sheet1.setColumnWidth(0, (short)50);
			sheet1.autoSizeColumn(3); // adjust width of the second column
			sheet1.autoSizeColumn(6); // adjust width of the second column
			// 使用apache的commons-lang.jar产生随机的字符串作为文件名
			String fileName = RandomStringUtils.randomAlphanumeric(6);
			// 生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
			StringBuffer sb = new StringBuffer(fileName);

			final File file = new File(sb.append(".xls").toString());
			try {
				OutputStream os = new FileOutputStream(file);
				try {
					wb.write(os);
					os.close();
				} catch (IOException e) {
					e.printStackTrace();
				}

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}

			try {
				is = new FileInputStream(file);
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
		}
		return is;// 返回的是一个输入流

	}
	
	@Override
	public List<ReceiveReport> queryReportStepBySend(String depName,
			String flowName, String flowStatus, String beginDate,
			String endDate, String overDateFlag) {
		// TODO Auto-generated method stub
		return dao.queryReportStepBySend(depName, flowName, flowStatus, beginDate, endDate, overDateFlag);
	}
	
	@Override
	public InputStream listToSendStepExcel(List<ReceiveReport> list,
			String beginDate, String endDate, String staticsDate) {

		logger.info("------coming into listToReceiveExcel methods---------");
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("发文报表统计");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$J$1"));
			
			Region region= new Region(0, (short)0, 1, (short)9);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			// header row 第2行
			Row headerRow = sheet1.createRow(1);
			headerRow.setHeightInPoints(20);
			Cell headerCell1;
			//header1 第1列
			headerCell1 = headerRow.createCell(0);
			headerCell1.setCellValue("");
			headerCell1.setCellStyle(styles.get("header"));
			
			//header1 第3列
			headerCell1 = headerRow.createCell(1);
			headerCell1.setCellValue("起始时间:"+beginDate+"     "+"截止时间:"+endDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$B$2:$F$2"));
			//header1 第4列
			headerCell1 = headerRow.createCell(6);
			headerCell1.setCellValue("统计时间:"+staticsDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$G$2:$J$2"));
			
			Region region0= new Region(1, (short)1, 2, (short)9);
			this.setRegionStyle(sheet1, region0, styles.get("header"));
			
			
			// header2 row 第3行
			Row headerRow2 = sheet1.createRow(2);
			headerRow2.setHeightInPoints(40);
			Cell headerCell2;
			//第4行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("流程名称");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("主题");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(2);
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2.setCellValue("发文部门");
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2.setCellValue("发起人");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(4);
			headerCell2.setCellValue("发文时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(5);
			headerCell2.setCellValue("超时处理人");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(6);
			headerCell2.setCellValue("处理时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(7);
			headerCell2.setCellValue("上一步处理时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(8);
			headerCell2.setCellValue("状态");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(9);
			headerCell2.setCellValue("处理时长（天）");
			headerCell2.setCellStyle(styles.get("header"));
			
			sheet1.setColumnWidth(0, (short)7000);
			sheet1.setColumnWidth(1, (short)10000);
			sheet1.setColumnWidth(2, (short)7000);
			sheet1.setColumnWidth(4, (short)6000);
			sheet1.setColumnWidth(6, (short)6000);
			sheet1.setColumnWidth(7, (short)6000);
			sheet1.setColumnWidth(9, (short)3000);
			
			
			int rownum = 3;
			
			Cell cell = null;
			
			for (ReceiveReport iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 10; j++) {
	                cell = row.createCell(j);
	                if(j == 0){
	                	cell.setCellValue(iter.getName());
	                }else if(j == 1){
	                	cell.setCellValue(iter.getSubject());
	                }else if(j == 2){
	                	cell.setCellValue(iter.getSendDep());
	                }else if(j == 3){
	                	cell.setCellValue(iter.getSender());
	                }else if(j == 4){
	                	cell.setCellValue(iter.getSendTime());
	                }else if(j == 5){
	                	cell.setCellValue(iter.getStepDealer());
	                }else if(j == 6){
	                	cell.setCellValue(iter.getStepFinishTime());
	                }else if(j == 7){
	                	cell.setCellValue(iter.getPreStepFinishTime());
	                }else if(j == 8){
	                	cell.setCellValue(iter.getStatus());
	                }else if(j == 9){
	                	//String dealTime = convertDealTime(iter.getDealTime());
	                	cell.setCellValue(iter.getSetpTime());
	                } 
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			
			sheet1.autoSizeColumn(1); //adjust width of the second column
			sheet1.autoSizeColumn(2); //adjust width of the second column
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
	            try {
	                 wb.write(os);
	                  os.close();
	            } catch (IOException e) {
	            	e.printStackTrace();
	            }

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			
	       try {
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	}
	@Override
	public InputStream listToReceiveStepExcel(List<ReceiveReport> list,
			String beginDate, String endDate, String staticsDate) {

		logger.info("------coming into listToReceiveStepExcel methods---------");
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("收文报表统计");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$K$1"));
			
			Region region= new Region(0, (short)0, 1, (short)10);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			// header row 第2行
			Row headerRow = sheet1.createRow(1);
			headerRow.setHeightInPoints(20);
			Cell headerCell1;
			//header1 第1列
			headerCell1 = headerRow.createCell(0);
			headerCell1.setCellValue("");
			headerCell1.setCellStyle(styles.get("header"));
			
			//header1 第3列
			headerCell1 = headerRow.createCell(1);
			headerCell1.setCellValue("起始时间:"+beginDate+"     "+"截止时间:"+endDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$B$2:$F$2"));
			//header1 第4列
			headerCell1 = headerRow.createCell(6);
			headerCell1.setCellValue("统计时间:"+staticsDate);
			headerCell1.setCellStyle(styles.get("header"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$G$2:$K$2"));
			
			Region region0= new Region(1, (short)1, 2, (short)10);
			this.setRegionStyle(sheet1, region0, styles.get("header"));
			
			
			// header2 row 第3行
			Row headerRow2 = sheet1.createRow(2);
			headerRow2.setHeightInPoints(40);
			Cell headerCell2;
			//第4行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("收文部门");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("流程名称");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(2);
			headerCell2.setCellValue("主题");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2.setCellValue("发文部门");
			headerCell2 = headerRow2.createCell(4);
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2.setCellValue("发起人");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(5);
			headerCell2.setCellValue("发文时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(6);
			headerCell2.setCellValue("超时处理人");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(7);
			headerCell2.setCellValue("处理时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(8);
			headerCell2.setCellValue("上一步处理时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(9);
			headerCell2.setCellValue("状态");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(10);
			headerCell2.setCellValue("处理时长（天）");
			headerCell2.setCellStyle(styles.get("header"));
			
			sheet1.setColumnWidth(0, (short)6000);
			sheet1.setColumnWidth(1, (short)7000);
			sheet1.setColumnWidth(2, (short)7000);
			sheet1.setColumnWidth(4, (short)6000);
			sheet1.setColumnWidth(5, (short)6000);
			//sheet1.setColumnWidth(6, (short)6000);
			sheet1.setColumnWidth(7, (short)6000);
			sheet1.setColumnWidth(8, (short)6000);
			sheet1.setColumnWidth(9, (short)3000);
			
			
			int rownum = 3;
			
			Cell cell = null;
			
			for (ReceiveReport iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 11; j++) {
	                cell = row.createCell(j);
	                if(j == 0){
	                	cell.setCellValue(iter.getRecDep());
	                }else if(j == 1){
	                	cell.setCellValue(iter.getName());
	                }else if(j == 2){
	                	cell.setCellValue(iter.getSubject());
	                }else if(j == 3){
	                	cell.setCellValue(iter.getSendDep());
	                }else if(j == 4){
	                	cell.setCellValue(iter.getSender());
	                }else if(j == 5){
	                	cell.setCellValue(iter.getSendTime());
	                }else if(j == 6){
	                	cell.setCellValue(iter.getStepDealer());
	                }else if(j == 7){
	                	cell.setCellValue(iter.getStepFinishTime());
	                }else if(j == 8){
	                	cell.setCellValue(iter.getPreStepFinishTime());
	                }else if(j == 9){
	                	cell.setCellValue(iter.getStatus());
	                }else if(j == 10){
	                	//String dealTime = convertDealTime(iter.getDealTime());
	                	cell.setCellValue(iter.getSetpTime());
	                } 
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			
			sheet1.autoSizeColumn(1); //adjust width of the second column
			sheet1.autoSizeColumn(2); //adjust width of the second column
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
	            try {
	                 wb.write(os);
	                  os.close();
	            } catch (IOException e) {
	            	e.printStackTrace();
	            }

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			
	       try {
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	}
	@Override
	public List<ReceiveReport> queryReportStepByReceive(String depName,
			String flowName, String flowStatus, String beginDate,
			String endDate, String overDateFlag) {
		// TODO Auto-generated method stub
		return dao.queryReportStepByReceive(depName, flowName, flowStatus, beginDate, endDate, overDateFlag);
	}
	
}
